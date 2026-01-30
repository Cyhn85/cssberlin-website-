/**
 * CSS Berlin — Member incentives
 * - Welcome overlay for new members (%10 discount + free shipping >= 50€)
 * - Persistence: localStorage + (if available) backend flag
 */
(() => {
  if (window.__cssberlinMemberIncentivesLoaded) return;
  window.__cssberlinMemberIncentivesLoaded = true;

  const DISCOUNT_TEXT = '10% Mitgliederrabatt';
  const FREE_SHIP_TEXT = 'Gratis Versand ab 50€';

  function getCurrentUser() {
    try {
      if (window.authGate?.currentUser) return window.authGate.currentUser;
      const raw = localStorage.getItem('cssberlin_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getSeenKey(user) {
    const id = user?.id || user?.email || 'anonymous';
    return `cssberlin_member_welcome_seen_${id}`;
  }

  function hasSeen(user) {
    try {
      return localStorage.getItem(getSeenKey(user)) === '1';
    } catch {
      return false;
    }
  }

  function markSeenLocal(user) {
    try {
      localStorage.setItem(getSeenKey(user), '1');
    } catch {
      // ignore
    }
  }

  function ensureStyles() {
    if (document.getElementById('member-incentives-styles')) return;
    const style = document.createElement('style');
    style.id = 'member-incentives-styles';
    style.textContent = `
      .member-welcome-overlay {
        position: fixed;
        inset: 0;
        z-index: 10050;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: radial-gradient(1200px 800px at 20% 15%, rgba(232,133,76,0.18), transparent 60%),
                    radial-gradient(900px 700px at 85% 80%, rgba(45,80,22,0.22), transparent 55%),
                    rgba(6, 10, 20, 0.65);
        backdrop-filter: blur(10px);
      }
      .member-welcome-card {
        width: 100%;
        max-width: 560px;
        border-radius: 18px;
        overflow: hidden;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow: 0 28px 90px rgba(0,0,0,0.45);
      }
      .member-welcome-inner {
        padding: 22px 22px 18px;
        background: linear-gradient(135deg, rgba(255,140,66,0.22), rgba(45,80,22,0.18));
      }
      .member-welcome-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }
      .member-welcome-title {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.2px;
        color: #fff;
      }
      .member-welcome-subtitle {
        margin: 6px 0 0;
        color: rgba(255,255,255,0.85);
        font-size: 13px;
        line-height: 1.55;
      }
      .member-welcome-close {
        width: 36px;
        height: 36px;
        border: 1px solid rgba(255,255,255,0.22);
        background: rgba(0,0,0,0.22);
        border-radius: 10px;
        color: rgba(255,255,255,0.9);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform .2s ease, background .2s ease;
      }
      .member-welcome-close:hover { transform: translateY(-1px); background: rgba(0,0,0,0.32); }
      .member-welcome-badges {
        display: grid;
        gap: 10px;
        margin-top: 14px;
      }
      .member-welcome-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 12px;
        border-radius: 12px;
        background: rgba(0,0,0,0.18);
        border: 1px solid rgba(255,255,255,0.14);
      }
      .member-welcome-badge strong {
        color: #fff;
        font-size: 14px;
      }
      .member-welcome-badge span {
        color: rgba(255,255,255,0.78);
        font-size: 12px;
      }
      .member-welcome-actions {
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }
      .member-welcome-btn {
        flex: 1;
        padding: 12px 14px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-weight: 800;
        letter-spacing: .2px;
        transition: transform .2s ease, box-shadow .2s ease;
      }
      .member-welcome-btn.primary {
        color: #fff;
        background: linear-gradient(135deg, #E8854C 0%, #2D5016 100%);
        box-shadow: 0 12px 26px rgba(0,0,0,0.25);
      }
      .member-welcome-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 16px 36px rgba(0,0,0,0.32); }
      .member-welcome-btn.secondary {
        color: rgba(255,255,255,0.9);
        background: rgba(255,255,255,0.10);
        border: 1px solid rgba(255,255,255,0.18);
      }
      .member-welcome-btn.secondary:hover { transform: translateY(-1px); }
      .member-welcome-footnote {
        margin: 12px 0 0;
        color: rgba(255,255,255,0.65);
        font-size: 11px;
        line-height: 1.5;
      }
    `;
    document.head.appendChild(style);
  }

  async function markSeenBackend() {
    try {
      if (!window.api || typeof window.api.request !== 'function') return;
      await window.api.request('/api/users/me/member-incentives/welcome-seen', {
        method: 'POST',
        body: JSON.stringify({ seen: true }),
      });
    } catch {
      // ignore
    }
  }

  function showModal(user) {
    if (document.getElementById('memberWelcomeOverlay')) return;
    ensureStyles();

    const firstName = user?.firstName || user?.first_name || user?.email?.split('@')?.[0] || '👋';
    const overlay = document.createElement('div');
    overlay.id = 'memberWelcomeOverlay';
    overlay.className = 'member-welcome-overlay';
    overlay.innerHTML = `
      <div class="member-welcome-card" role="dialog" aria-modal="true" aria-label="Willkommen">
        <div class="member-welcome-inner">
          <div class="member-welcome-top">
            <div>
              <h3 class="member-welcome-title">Willkommen, ${escapeHtml(firstName)}!</h3>
              <p class="member-welcome-subtitle">
                Schön, dass du dabei bist. Als Mitglied bekommst du sofort zwei Vorteile im Checkout.
              </p>
            </div>
            <button class="member-welcome-close" aria-label="Schließen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="member-welcome-badges">
            <div class="member-welcome-badge">
              <div style="width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(232,133,76,0.22);border:1px solid rgba(255,255,255,0.14);">
                <span style="font-size:16px;">%</span>
              </div>
              <div>
                <strong>${DISCOUNT_TEXT}</strong><br>
                <span>Wird automatisch im Checkout abgezogen.</span>
              </div>
            </div>
            <div class="member-welcome-badge">
              <div style="width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(45,80,22,0.24);border:1px solid rgba(255,255,255,0.14);">
                <span style="font-size:16px;">📦</span>
              </div>
              <div>
                <strong>${FREE_SHIP_TEXT}</strong><br>
                <span>Ab 50€ Warenwert wird Versand automatisch 0€.</span>
              </div>
            </div>
          </div>

          <div class="member-welcome-actions">
            <button class="member-welcome-btn secondary" data-action="later">Später</button>
            <button class="member-welcome-btn primary" data-action="shop">Jetzt shoppen</button>
          </div>
          <p class="member-welcome-footnote">
            Hinweis: Rabatte/Versand gelten im Checkout. (Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.)
          </p>
        </div>
      </div>
    `;

    function closeAndRemember(goShop) {
      markSeenLocal(user);
      markSeenBackend();
      overlay.remove();
      document.body.style.overflow = '';
      if (goShop) {
        const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
        if (page && page !== 'index.html' && page !== '') {
          window.location.href = 'index.html';
        } else {
          const target = document.querySelector('#productsGrid, #productGrid, .products-grid, main');
          if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAndRemember(false);
    });
    overlay.querySelector('.member-welcome-close')?.addEventListener('click', () => closeAndRemember(false));
    overlay.querySelector('[data-action="later"]')?.addEventListener('click', () => closeAndRemember(false));
    overlay.querySelector('[data-action="shop"]')?.addEventListener('click', () => closeAndRemember(true));
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        closeAndRemember(false);
      }
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function maybeShowWelcome() {
    const user = getCurrentUser();
    if (!user) return;
    if (hasSeen(user)) return;

    let backendSaysSeen = false;
    let backendSaysEligible = true;
    try {
      if (window.api && typeof window.api.getCurrentUser === 'function') {
        const me = await window.api.getCurrentUser();
        backendSaysSeen = me?.member_welcome_seen === true;
        backendSaysEligible = me?.member_discount_active !== false;
      }
    } catch {
      // ignore (offline/local auth)
    }

    if (backendSaysSeen) {
      markSeenLocal(user);
      return;
    }
    if (!backendSaysEligible) return;

    setTimeout(() => showModal(user), 650);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeShowWelcome);
  } else {
    maybeShowWelcome();
  }
})();

