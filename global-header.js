/**
 * CSS Berlin - Global Header Component
 * 
 * THIS FILE IS NOW DEPRECATED
 * All pages use header-v3.css with inline HTML
 * 
 * This file is kept for backward compatibility but does nothing.
 */

const GlobalHeader = {
    init() {
        console.log('[GlobalHeader] This component is deprecated. Use header-v3 instead.');
    },

    injectHeader() {
        // No operation - header-v3 is in HTML
    },

    injectFooter() {
        // No operation - footer is in HTML
    }
};

// Global access for backward compatibility
window.GlobalHeader = GlobalHeader;
