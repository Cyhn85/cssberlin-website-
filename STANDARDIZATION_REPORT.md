# Website Standardization Report

## Overview
We have identified the following key pages that require standardization to match the new "Smart Header" and V3 Design System.

### Core Pages (To Be Updated)
1. **index.html** (Home) - *Master Template (Done)*
   - Status: Complete (Smart Header + V3 Footer + 4-Col Grid)
2. **Category Pages**
   - `damen.html` (Women's Fashion)
   - `herren.html` (Men's Fashion)
   - `kinder.html` (Kids)
   - `elektronik.html` (Electronics)
   - `sonstiges.html` (Misc)
   - `sale.html` (Sales)
3. **Product Pages**
   - `product-detail.html` (Single Product View)
   - `inserieren.html` (Sell Item)
4. **User Dashboard**
   - `wunschliste.html` (Wishlist)
   - `warenkorb.html` (Cart)
   - `meine-anzeigen.html` (My Listings)
   - `tekliflerim.html` (My Offers)
5. **Legals & Info**
   - `impressum.html`, `datenschutz.html`, `agb.html`
   - `kontakt.html`, `ueber-uns.html`, `wie-funktioniert-es.html`

## Action Plan
1. **Header Standardization**:
   - Apply `header-v3.css` styles.
   - Inject the new HTML Header structure (Logo, Smart Search, Registrieren Button).
   - Attach `smart-header.js`.
2. **Footer Standardization**:
   - Apply `footer-v3.css` styles.
   - Inject the new Vinted-style 3-column footer.
3. **Product Buttons (Fix)**:
   - Restore "Smart Design" gradient buttons in all product cards.
   - Ensure perfect symmetry (Buy vs Offer).

## Detected Issue
- **Missing Buttons**: The Gradient Buttons ("akilli tasarim butonlar") appear to be missing or misaligned in the product cards on `index.html`.
- **Solution**: We will enforce the display of these buttons via updated CSS and ensuring the correct classes are generated in `script.js`.
