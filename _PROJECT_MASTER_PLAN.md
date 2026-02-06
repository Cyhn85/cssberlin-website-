# CSS BERLIN - PROJECT MASTER PLAN
## Single Source of Truth | German Engineering Standard

**Last Updated:** 2026-02-06
**Version:** 1.0.0
**Architect:** CBOA (CSS Berlin Omniscient Architect)

---

## EXECUTIVE STATUS

| Domain | Status | Completion |
|--------|--------|------------|
| Frontend | Functional | ~75% |
| Backend | Operational | ~70% |
| Auth System | Working | ~85% |
| Legal Compliance | INCOMPLETE | ~60% |
| Error Logging | INCOMPLETE | ~40% |
| Payment System | NOT STARTED | 0% |
| Shipping API | NOT STARTED | 0% |

---

## SECTION 1: LEGAL & COMPLIANCE (GERMAN LAW - NON-NEGOTIABLE)

### 1.1 Impressum
| Task | Status | Notes |
|------|--------|-------|
| Impressum page exists | 🟢 [DONE] | `impressum.html` present |
| Business owner info | 🟡 [PLACEHOLDER] | ⚠️ Uses "Musterstraße/Mustermann" - REPLACE WITH REAL DATA |
| Kleinunternehmer §19 UStG clause | 🟢 [DONE] | Line 143: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet" |
| Handelsregister info | 🟡 [PLACEHOLDER] | ⚠️ Uses "HRB 123456" - REPLACE WITH REAL DATA |

### 1.2 Datenschutz (GDPR Privacy Policy)
| Task | Status | Notes |
|------|--------|-------|
| Datenschutz page exists | 🟢 [DONE] | `datenschutz.html` present |
| Data collection disclosure | 🟢 [DONE] | Section 2: Registration, usage, orders |
| Third-party services listed | 🟢 [DONE] | Section 5: Google OAuth, IONOS, Cloudflare |
| Cookie usage explained | 🟢 [DONE] | Section 6: Links to cookie.html |
| User rights (Art. 15-22) | 🟢 [DONE] | Section 7: All GDPR rights listed |
| Data retention | 🟢 [DONE] | Section 8: Retention periods |
| Complaint authority | 🟢 [DONE] | Section 10: Berlin DPA contact |

### 1.3 Cookie Consent Banner (CRITICAL)
| Task | Status | Notes |
|------|--------|-------|
| GDPR Cookie Banner | 🟢 [DONE] | `cookie-consent.js/css` created |
| Accept/Reject options | 🟢 [DONE] | Accept All, Reject All, Custom |
| Granular cookie control | 🟢 [DONE] | Essential, Analytics, Marketing |
| localStorage consent | 🟢 [DONE] | Persistent with version control |
| Link to cookie.html | 🟢 [DONE] | `cookie.html` exists |
| Integration in index.html | 🟢 [DONE] | Added to main page |
| Integration in all pages | 🔴 [PENDING] | Need to add to other pages |

### 1.4 Widerrufsrecht (Right of Withdrawal)
| Task | Status | Notes |
|------|--------|-------|
| Widerrufsrecht page | 🟢 [DONE] | `widerrufsrecht.html` exists |
| 14-day return policy | 🔴 [PENDING] | VERIFY content |

### 1.5 AGB (Terms & Conditions)
| Task | Status | Notes |
|------|--------|-------|
| AGB page exists | 🟢 [DONE] | `agb.html` present |
| Kleinunternehmer clause | 🔴 [PENDING] | VERIFY: "Umsatzsteuer nicht ausgewiesen" |

---

## SECTION 2: WATCHTOWER (ERROR LOGGING SYSTEM)

### 2.1 Frontend Error Capture
| Task | Status | Notes |
|------|--------|-------|
| `window.onerror` handler | 🟢 [DONE] | `error-logger.js` exists |
| `unhandledrejection` handler | 🟢 [DONE] | Implemented |
| Save to localStorage | 🟢 [DONE] | Max 100 entries |
| Send errors to backend | 🟢 [DONE] | `sendToBackend()` function added |
| Error export function | 🟢 [DONE] | `errorLogger.exportLogs()` |

### 2.2 Backend Error Logging
| Task | Status | Notes |
|------|--------|-------|
| Global exception handler | 🟢 [DONE] | `main.py` line 48-62 |
| Console traceback | 🟢 [DONE] | Prints to stdout |
| Write to `server_error.log` | 🟢 [DONE] | `error_logger.py` with RotatingFileHandler |
| Timestamped entries | 🟢 [DONE] | Format: `YYYY-MM-DD HH:MM:SS` |
| Log rotation | 🟢 [DONE] | 5MB max, 5 backups |

### 2.3 Error Reporting API
| Task | Status | Notes |
|------|--------|-------|
| `/api/errors/report` endpoint | 🟢 [DONE] | POST endpoint in `error_logger.py` |
| `/api/errors/stats` endpoint | 🟢 [DONE] | Get error statistics |
| `/api/errors/recent` endpoint | 🟢 [DONE] | Get recent errors |
| Admin error dashboard | 🔴 [PENDING] | View errors in admin UI |

---

## SECTION 3: AUTHENTICATION SYSTEM

### 3.1 Email + Password Auth
| Task | Status | Notes |
|------|--------|-------|
| Registration form | 🟢 [DONE] | `registrieren.html` |
| Login form | 🟢 [DONE] | `login.html` |
| Password hashing (bcrypt) | 🟢 [DONE] | Backend `auth.py` |
| JWT tokens | 🟢 [DONE] | Implemented |
| Email verification | 🟢 [DONE] | Magic Link working |
| Forgot password flow | 🟢 [DONE] | `forgot-password.html` |

### 3.2 Google OAuth
| Task | Status | Notes |
|------|--------|-------|
| Google OAuth integration | 🟢 [DONE] | Client ID configured |
| Production domain | 🟡 [IN PROGRESS] | Needs Cloudflare domain |
| Auto-register new users | 🟢 [DONE] | Implemented |

### 3.3 Magic Link Auth
| Task | Status | Notes |
|------|--------|-------|
| Magic Link generation | 🟢 [DONE] | `auth_oauth.py` |
| Email sending (IONOS SMTP) | 🟢 [DONE] | `email_service.py` |
| Token verification | 🟢 [DONE] | 15-min expiry |

### 3.4 User Session Management
| Task | Status | Notes |
|------|--------|-------|
| User profile page | 🟢 [DONE] | `mein-konto.html` |
| Session persistence | 🟢 [DONE] | localStorage + JWT |
| Logout functionality | 🟢 [DONE] | Header integration |

---

## SECTION 4: BACKEND INFRASTRUCTURE

### 4.1 FastAPI Core
| Task | Status | Notes |
|------|--------|-------|
| FastAPI app setup | 🟢 [DONE] | `main.py` v3.0.0 |
| CORS configuration | 🟢 [DONE] | Production origins set |
| Health endpoint | 🟢 [DONE] | `/health` |
| Exception handler | 🟢 [DONE] | Global catch-all |

### 4.2 Database
| Task | Status | Notes |
|------|--------|-------|
| SQLite setup | 🟢 [DONE] | Current database |
| SQLAlchemy models | 🟢 [DONE] | `models.py` |
| Auto-table creation | 🟢 [DONE] | On startup |
| PostgreSQL migration | 🔴 [PENDING] | Future: Production DB |

### 4.3 API Routers
| Task | Status | Notes |
|------|--------|-------|
| Auth router | 🟢 [DONE] | `/register`, `/login`, etc. |
| Auth OAuth router | 🟢 [DONE] | Magic Link, OAuth |
| Products router | 🟢 [DONE] | CRUD operations |
| Offers router | 🟢 [DONE] | Negotiation system |
| Payments router | 🟢 [DONE] | Placeholder ready |

### 4.4 Email Service
| Task | Status | Notes |
|------|--------|-------|
| IONOS SMTP config | 🟢 [DONE] | noreply@cssberlin.de |
| Magic Link emails | 🟢 [DONE] | Working |
| Order confirmation emails | 🔴 [PENDING] | Not implemented |
| HTML email templates | 🟢 [DONE] | `email-templates/` |

---

## SECTION 5: FRONTEND STRUCTURE

### 5.1 Core Pages
| Page | Status | Notes |
|------|--------|-------|
| index.html | 🟢 [DONE] | Homepage with products |
| login.html | 🟢 [DONE] | Auth modal |
| registrieren.html | 🟢 [DONE] | Registration |
| mein-konto.html | 🟢 [DONE] | User dashboard |
| product-detail.html | 🟢 [DONE] | Product view |

### 5.2 E-Commerce Pages
| Page | Status | Notes |
|------|--------|-------|
| warenkorb.html | 🟢 [DONE] | Shopping cart |
| checkout.html | 🟡 [IN PROGRESS] | Needs payment integration |
| bestellung-bestaetigung.html | 🟢 [DONE] | Order confirmation |
| wunschliste.html | 🟢 [DONE] | Wishlist |

### 5.3 Category Pages
| Page | Status | Notes |
|------|--------|-------|
| damen.html | 🟢 [DONE] | Women's category |
| herren.html | 🟢 [DONE] | Men's category |
| kinder.html | 🟢 [DONE] | Kids category |

### 5.4 Legal Pages
| Page | Status | Notes |
|------|--------|-------|
| impressum.html | 🟢 [DONE] | Needs content verification |
| datenschutz.html | 🟢 [DONE] | Needs content verification |
| agb.html | 🟢 [DONE] | Needs content verification |
| widerrufsrecht.html | 🟢 [DONE] | Needs content verification |
| cookie.html | 🟢 [DONE] | Cookie info |

### 5.5 JavaScript Modules
| Module | Status | Notes |
|--------|--------|-------|
| auth.js | 🟢 [DONE] | Auth logic |
| auth-modal-v3.js | 🟢 [DONE] | Login/Register modal |
| api-client.js | 🟢 [DONE] | Backend API calls |
| api-config.js | 🟢 [DONE] | Environment detection |
| error-logger.js | 🟡 [IN PROGRESS] | Needs backend integration |
| toast.js | 🟢 [DONE] | Notifications |
| footer.js | 🟢 [DONE] | Footer interactions |

---

## SECTION 6: PAYMENT SYSTEM (NOT STARTED)

### 6.1 Stripe Integration
| Task | Status | Notes |
|------|--------|-------|
| Stripe account | 🔴 [PENDING] | Create account |
| API keys config | 🔴 [PENDING] | Test + Live |
| Payment Intent API | 🔴 [PENDING] | Backend |
| Stripe Elements (frontend) | 🔴 [PENDING] | Card form |
| Webhook handler | 🔴 [PENDING] | Payment confirmation |

### 6.2 PayPal Integration
| Task | Status | Notes |
|------|--------|-------|
| PayPal business account | 🔴 [PENDING] | Create account |
| SDK integration | 🔴 [PENDING] | Frontend |
| IPN handler | 🔴 [PENDING] | Backend |

### 6.3 Escrow System (Buyer Protection)
| Task | Status | Notes |
|------|--------|-------|
| Escrow flow design | 🔴 [PENDING] | Payment hold |
| Release on delivery | 🔴 [PENDING] | Trigger mechanism |
| Dispute handling | 🔴 [PENDING] | Admin tools |

---

## SECTION 7: SHIPPING SYSTEM (NOT STARTED)

### 7.1 DHL Integration
| Task | Status | Notes |
|------|--------|-------|
| DHL Developer account | 🔴 [PENDING] | Register |
| Parcel DE API | 🔴 [PENDING] | Create shipment |
| Label generation | 🔴 [PENDING] | PDF labels |
| Tracking integration | 🔴 [PENDING] | Status updates |

### 7.2 Shipping UI
| Task | Status | Notes |
|------|--------|-------|
| Shipping options selector | 🔴 [PENDING] | Checkout step |
| Rate calculator | 🔴 [PENDING] | Weight/dimensions |
| Tracking page | 🟡 [IN PROGRESS] | `versand-tracking.html` exists |

---

## SECTION 8: ADMIN SYSTEM

### 8.1 Admin Dashboard
| Task | Status | Notes |
|------|--------|-------|
| Admin dashboard page | 🟢 [DONE] | `admin-dashboard.html` |
| Admin authentication | 🟢 [DONE] | Email-based check |
| Product management | 🟢 [DONE] | CRUD via API |
| User management | 🔴 [PENDING] | List/ban users |
| Order management | 🔴 [PENDING] | View/process orders |
| Error log viewer | 🔴 [PENDING] | See system errors |

---

## SECTION 9: DEPLOYMENT & INFRASTRUCTURE

### 9.1 Frontend (Cloudflare Pages)
| Task | Status | Notes |
|------|--------|-------|
| Cloudflare Pages setup | 🟢 [DONE] | cssberlin-website.pages.dev |
| Custom domain | 🟡 [IN PROGRESS] | cssberlin.de pending |
| CNAME file | 🟢 [DONE] | Present |

### 9.2 Backend (Hetzner)
| Task | Status | Notes |
|------|--------|-------|
| Hetzner server | 🟢 [DONE] | Running |
| Python environment | 🟢 [DONE] | FastAPI |
| SSL/HTTPS | 🔴 [PENDING] | Needs configuration |
| Domain pointing | 🔴 [PENDING] | api.cssberlin.de |
| Process manager (systemd) | 🔴 [PENDING] | Auto-restart |

### 9.3 Database (Production)
| Task | Status | Notes |
|------|--------|-------|
| SQLite (current) | 🟢 [DONE] | Development |
| PostgreSQL (future) | 🔴 [PENDING] | Production migration |
| Backup system | 🔴 [PENDING] | Automated backups |

---

## PRIORITY EXECUTION ORDER

### CRITICAL (Must Fix First)
1. 🟢 **Cookie Consent Banner** - Legal requirement (GDPR) ✓ DONE
2. 🟢 **Kleinunternehmer clause in Impressum** - Already exists ✓ DONE
3. 🟢 **Error logging to backend** - Watchtower system ✓ DONE
4. 🟢 **Backend server_error.log** - Persistent logging ✓ DONE

### HIGH PRIORITY
5. 🟢 Verify Datenschutz content completeness ✓ DONE (Full GDPR compliance added)
6. 🔴 Backend SSL/HTTPS on Hetzner
7. 🔴 Admin error log viewer (uses `/api/errors/recent`)

### MEDIUM PRIORITY
8. 🔴 Stripe payment integration
9. 🔴 DHL shipping integration
10. 🔴 PostgreSQL migration

### LOW PRIORITY
11. 🔴 PayPal integration
12. 🔴 Additional shipping providers
13. 🔴 Advanced admin features

---

## CURRENT EXECUTION TARGET

**NOW EXECUTING:** 🔴 #6 - Backend SSL/HTTPS on Hetzner (Requires server access)

---

## CHANGE LOG

| Date | Change | Author |
|------|--------|--------|
| 2026-02-06 | Initial Master Plan created | CBOA |
| 2026-02-06 | Cookie Consent Banner implemented | CBOA |
| 2026-02-06 | Kleinunternehmer clause verified (exists) | CBOA |
| 2026-02-06 | Watchtower Error System implemented (frontend + backend) | CBOA |
| 2026-02-06 | Datenschutz page rewritten with full GDPR compliance | CBOA |

---

*This document is the single source of truth. All team members must reference this plan.*
