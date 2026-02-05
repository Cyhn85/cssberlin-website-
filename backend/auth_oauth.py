# backend/auth_oauth.py
"""
CSS Berlin — OAuth & Magic Link Authentication
Google OAuth, Apple Sign In, Magic Link support
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from authlib.integrations.starlette_client import OAuth
from itsdangerous import URLSafeTimedSerializer
import os
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional

from database import get_db
from models import User
from auth import get_password_hash, create_access_token

# ─── Environment Variables ──────────────────────────────────
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID", "")
APPLE_TEAM_ID = os.getenv("APPLE_TEAM_ID", "")
APPLE_KEY_ID = os.getenv("APPLE_KEY_ID", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# Magic Link Settings
SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_css_berlin_2026")
MAGIC_LINK_EXPIRE_MINUTES = 15

# Email Settings (SMTP)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@cssberlin.de")

router = APIRouter(prefix="/api/auth", tags=["OAuth & Magic Link"])

# ─── OAuth Configuration ────────────────────────────────────
oauth = OAuth()

# Google OAuth
if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'},
    )

# ─── Serializer for Magic Links ─────────────────────────────
serializer = URLSafeTimedSerializer(SECRET_KEY)


# ─── Pydantic Models ────────────────────────────────────────
class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerify(BaseModel):
    token: str


# ═══════════════════════════════════════════════════════════
# GOOGLE OAUTH
# ═══════════════════════════════════════════════════════════

@router.get("/google")
async def google_login(request: Request):
    """Redirect to Google OAuth consent screen"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")

    redirect_uri = f"{BACKEND_URL}/api/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')

        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")

        email = user_info.get('email')
        given_name = user_info.get('given_name', '')
        family_name = user_info.get('family_name', '')

        # Check if user exists
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            # Create new user
            user = User(
                email=email,
                hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Random password
                first_name=given_name,
                last_name=family_name,
                is_active=True,
                is_verified=True,  # Google verified
                oauth_provider='google',
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # Create access token
        access_token = create_access_token(data={"sub": user.email})

        # Redirect to frontend with token
        redirect_url = f"{FRONTEND_URL}/?auth_token={access_token}&user_name={user.first_name}"
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        print(f"[Google OAuth Error] {str(e)}")
        return RedirectResponse(url=f"{FRONTEND_URL}/?error=google_auth_failed")


# ═══════════════════════════════════════════════════════════
# APPLE SIGN IN
# ═══════════════════════════════════════════════════════════

@router.get("/apple")
async def apple_login(request: Request):
    """Redirect to Apple Sign In (placeholder)"""
    raise HTTPException(
        status_code=501,
        detail="Apple Sign In coming soon. Please use Google or Magic Link."
    )


# ═══════════════════════════════════════════════════════════
# MAGIC LINK (Email-based passwordless auth)
# ═══════════════════════════════════════════════════════════

@router.post("/magic-link")
async def send_magic_link(data: MagicLinkRequest, db: AsyncSession = Depends(get_db)):
    """Send magic link to user's email"""

    # Check if user exists
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # If user doesn't exist, create a placeholder (or just send link anyway for security)
    if not user:
        # Option 1: Create user on magic link click
        # Option 2: Send link anyway (don't reveal if email exists)
        # We'll use Option 2 for better security
        pass

    # Generate token
    token = serializer.dumps(data.email, salt='magic-link')
    magic_link = f"{FRONTEND_URL}/magic-login?token={token}"

    # Send email
    try:
        send_magic_link_email(data.email, magic_link)
        return {
            "success": True,
            "message": "Magic link sent! Check your email.",
            "email": data.email
        }
    except Exception as e:
        print(f"[Email Error] {str(e)}")
        # Don't reveal email sending failures for security
        return {
            "success": True,
            "message": "If the email exists, a magic link has been sent.",
        }


@router.get("/magic-link/verify")
async def verify_magic_link(token: str, db: AsyncSession = Depends(get_db)):
    """Verify magic link token and log user in"""

    try:
        # Verify token (expires after MAGIC_LINK_EXPIRE_MINUTES)
        email = serializer.loads(
            token,
            salt='magic-link',
            max_age=MAGIC_LINK_EXPIRE_MINUTES * 60
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired magic link")

    # Check if user exists
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # Create new user (magic link registration)
        user = User(
            email=email,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            first_name=email.split('@')[0].capitalize(),
            last_name='',
            is_active=True,
            is_verified=True,
            oauth_provider='magic_link',
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Create access token
    access_token = create_access_token(data={"sub": user.email})

    # Redirect to frontend with token
    redirect_url = f"{FRONTEND_URL}/?auth_token={access_token}&user_name={user.first_name}"
    return RedirectResponse(url=redirect_url)


# ─── Email Sending Function ─────────────────────────────────
def send_magic_link_email(to_email: str, magic_link: str):
    """Send magic link email via SMTP"""

    # If SMTP not configured, just print to console (dev mode)
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"\n{'='*60}")
        print(f"[DEV MODE] Magic Link Email")
        print(f"To: {to_email}")
        print(f"Link: {magic_link}")
        print(f"{'='*60}\n")
        return

    # Create email
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '🔐 Your CSS Berlin Magic Link'
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email

    # Email body (HTML)
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', Arial, sans-serif; background: #f9fafb; padding: 40px 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
            .logo {{ font-size: 32px; font-weight: 900; margin-bottom: 20px; }}
            .logo span {{ color: #2D5016; }}
            h1 {{ color: #2D5016; font-size: 24px; margin-bottom: 16px; }}
            p {{ color: #555; line-height: 1.6; margin-bottom: 24px; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #FF8C42, #2D5016); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; }}
            .footer {{ margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">CSS<span>berlin</span></div>
            <h1>🔐 Your Magic Link is Ready!</h1>
            <p>Hi there! Click the button below to securely log in to CSS Berlin. This link expires in {MAGIC_LINK_EXPIRE_MINUTES} minutes.</p>
            <a href="{magic_link}" class="btn">Log In to CSS Berlin</a>
            <p style="margin-top: 24px; font-size: 13px; color: #777;">
                Or copy this link: <br>
                <code style="background: #f5f5f5; padding: 8px; border-radius: 6px; display: inline-block; margin-top: 8px; word-break: break-all;">{magic_link}</code>
            </p>
            <div class="footer">
                <p>If you didn't request this, please ignore this email.</p>
                <p>© 2026 CSS Berlin - Climate Smart Solutions</p>
            </div>
        </div>
    </body>
    </html>
    """

    part = MIMEText(html, 'html')
    msg.attach(part)

    # Send via SMTP
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


# ═══════════════════════════════════════════════════════════
# FORGOT PASSWORD (Password Reset)
# ═══════════════════════════════════════════════════════════

@router.post("/forgot-password")
async def forgot_password(data: MagicLinkRequest, db: AsyncSession = Depends(get_db)):
    """Send password reset link to user's email"""

    # Check if user exists
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # Don't reveal if email exists (security best practice)
    # Always return success message
    if not user:
        return {
            "success": True,
            "message": "If the email exists, a reset link has been sent.",
        }

    # Generate reset token
    token = serializer.dumps(data.email, salt='password-reset')
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    # Send email
    try:
        send_password_reset_email(data.email, reset_link, user.first_name)
        return {
            "success": True,
            "message": "Password reset link sent! Check your email.",
            "email": data.email
        }
    except Exception as e:
        print(f"[Email Error] {str(e)}")
        return {
            "success": True,
            "message": "If the email exists, a reset link has been sent.",
        }


class PasswordResetRequest(BaseModel):
    token: str
    new_password: str


@router.post("/reset-password")
async def reset_password(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    """Reset user password with token"""

    try:
        # Verify token (expires after 30 minutes)
        email = serializer.loads(
            data.token,
            salt='password-reset',
            max_age=30 * 60  # 30 minutes
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    # Find user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    user.hashed_password = get_password_hash(data.new_password)
    await db.commit()

    return {
        "success": True,
        "message": "Password successfully reset! You can now log in.",
    }


# ─── Email Sending Function for Password Reset ──────────────
def send_password_reset_email(to_email: str, reset_link: str, user_name: str):
    """Send password reset email via SMTP"""

    # If SMTP not configured, just print to console (dev mode)
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"\n{'='*60}")
        print(f"[DEV MODE] Password Reset Email")
        print(f"To: {to_email}")
        print(f"Link: {reset_link}")
        print(f"{'='*60}\n")
        return

    # Create email
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '🔒 Reset Your CSS Berlin Password'
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email

    # Email body (HTML)
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', Arial, sans-serif; background: #f9fafb; padding: 40px 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
            .logo {{ font-size: 32px; font-weight: 900; margin-bottom: 20px; }}
            .logo span {{ color: #2D5016; }}
            h1 {{ color: #2D5016; font-size: 24px; margin-bottom: 16px; }}
            p {{ color: #555; line-height: 1.6; margin-bottom: 24px; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #FF8C42, #2D5016); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; }}
            .footer {{ margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px; }}
            .alert {{ background: #FFF3CD; border: 1px solid #FFE69C; color: #856404; padding: 16px; border-radius: 8px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">CSS<span>berlin</span></div>
            <h1>🔒 Reset Your Password</h1>
            <p>Hi {user_name}!</p>
            <p>We received a request to reset your CSS Berlin password. Click the button below to create a new password. This link expires in 30 minutes.</p>
            <a href="{reset_link}" class="btn">Reset Password</a>
            <p style="margin-top: 24px; font-size: 13px; color: #777;">
                Or copy this link: <br>
                <code style="background: #f5f5f5; padding: 8px; border-radius: 6px; display: inline-block; margin-top: 8px; word-break: break-all;">{reset_link}</code>
            </p>
            <div class="alert">
                ⚠️ If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </div>
            <div class="footer">
                <p>For security reasons, this link will expire in 30 minutes.</p>
                <p>© 2026 CSS Berlin - Climate Smart Solutions</p>
            </div>
        </div>
    </body>
    </html>
    """

    part = MIMEText(html, 'html')
    msg.attach(part)

    # Send via SMTP
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
