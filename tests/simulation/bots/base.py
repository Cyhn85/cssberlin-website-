from __future__ import annotations

import json
from dataclasses import dataclass

from playwright.async_api import BrowserContext, Page

from ..utils.artifacts import RunArtifacts


@dataclass(frozen=True)
class ActorIdentity:
    bot_name: str  # "SATICI" | "ALICI" | "ADMIN"
    email: str
    password: str
    first_name: str
    last_name: str


class BaseBot:
    def __init__(self, *, identity: ActorIdentity, context: BrowserContext, base_url: str, artifacts: RunArtifacts | None = None):
        self.identity = identity
        self.context = context
        self.base_url = base_url.rstrip("/")
        self.page: Page | None = None
        self.artifacts = artifacts

    async def new_page(self) -> Page:
        self.page = await self.context.new_page()
        if self.artifacts:
            self.artifacts.attach_page(page=self.page, bot=self.identity.bot_name)
        return self.page

    async def inject_auth_storage(self, *, access_token: str, user: dict) -> None:
        """
        The frontend has mixed auth keys (auth_token vs cssberlin_token).
        We set both so pages that rely on either one behave.
        """
        safe_user = {
            "id": user.get("id"),
            "email": user.get("email"),
            "firstName": user.get("first_name") or user.get("firstName") or self.identity.first_name,
            "lastName": user.get("last_name") or user.get("lastName") or self.identity.last_name,
            "first_name": user.get("first_name") or self.identity.first_name,
            "last_name": user.get("last_name") or self.identity.last_name,
            "role": user.get("role") or ("admin" if self.identity.bot_name == "ADMIN" else "user"),
            "loginMethod": "api",
        }

        init_script = f"""
(() => {{
  try {{
    localStorage.setItem('auth_token', {json.dumps(access_token)});
    localStorage.setItem('cssberlin_token', {json.dumps(access_token)});
    localStorage.setItem('cssberlin_current_user', {json.dumps(json.dumps(safe_user))});

    // Prevent cookie-consent modal from blocking UI in simulations
    if (!localStorage.getItem('cssberlin_cookie_consent')) {{
      localStorage.setItem('cssberlin_cookie_consent', JSON.stringify({{
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
      }}));
    }}
  }} catch (e) {{}}
}})();
"""
        await self.context.add_init_script(init_script)

