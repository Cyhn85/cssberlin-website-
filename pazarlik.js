document.addEventListener('DOMContentLoaded', () => {
    const negotiationsGrid = document.getElementById('negotiationsGrid');
    const emptyState = document.getElementById('emptyState');
    const filterTabs = document.querySelectorAll('.filter-tab');

    let allOffers = [];
    let currentFilter = 'all';
    let sockets = [];

    async function fetchOffers() {
        try {
            const response = await api.getOffers();
            allOffers = response.offers;
            renderOffers();
            setupWebSockets();
        } catch (error) {
            console.error('Error fetching offers:', error);
            if (negotiationsGrid) {
                negotiationsGrid.innerHTML = '<p>Error loading offers.</p>';
            }
        }
    }

    function renderOffers() {
        if (!negotiationsGrid) return;

        let filteredOffers = allOffers;
        if (currentFilter !== 'all') {
            filteredOffers = allOffers.filter(offer => offer.status === currentFilter);
        }

        if (filteredOffers.length === 0) {
            negotiationsGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            negotiationsGrid.style.display = 'grid';
            if (emptyState) emptyState.style.display = 'none';
            negotiationsGrid.innerHTML = filteredOffers.map(createNegotiationCard).join('');
        }
        updateCounts();
    }
    
    function updateCounts() {
        if (!document.getElementById('allCount')) return;
        
        const counts = {
            all: allOffers.length,
            pending: allOffers.filter(n => n.status === 'pending').length,
            countered: allOffers.filter(n => n.status === 'countered').length,
            accepted: allOffers.filter(n => n.status === 'accepted').length,
            rejected: allOffers.filter(n => n.status === 'rejected').length
        };

        document.getElementById('allCount').textContent = counts.all;
        document.getElementById('pendingCount').textContent = counts.pending;
        document.getElementById('counteredCount').textContent = counts.countered;
        document.getElementById('acceptedFilterCount').textContent = counts.accepted;
        document.getElementById('rejectedCount').textContent = counts.rejected;

        document.getElementById('activeCount').textContent = counts.pending + counts.countered;
        document.getElementById('acceptedCount').textContent = counts.accepted;

        const savings = allOffers
            .filter(n => n.status === 'accepted')
            .reduce((sum, n) => sum + (n.product_price - (n.counter_amount || n.offer_amount)), 0);
        document.getElementById('savedAmount').textContent = savings.toFixed(2) + '€';
    }
    
    function createNegotiationCard(offer) {
        const currentUser = authGate.currentUser;
        const isBuyer = currentUser.id === offer.buyer_id;

        const statusLabels = {
            pending: 'Ausstehend',
            countered: 'Gegenangebot',
            accepted: 'Angenommen',
            rejected: 'Abgelehnt',
            expired: 'Abgelaufen'
        };

        const statusIcons = {
            pending: '⏳',
            countered: '↩️',
            accepted: '✅',
            rejected: '❌',
            expired: '⌛'
        };

        let actionsHtml = '';
        if (offer.status === 'pending') {
            if (isBuyer) {
                 actionsHtml = `<button class="card-btn secondary" onclick="cancelOffer(${offer.id})">Zurückziehen</button>`;
            } else {
                 actionsHtml = `
                    <button class="card-btn danger" onclick="rejectOffer(${offer.id})">Ablehnen</button>
                    <button class="card-btn secondary" onclick="openCounterModal(${offer.id})">Gegenangebot</button>
                    <button class="card-btn success" onclick="acceptOffer(${offer.id})">Annehmen</button>`;
            }
        } else if (offer.status === 'countered') {
            if (isBuyer) {
                actionsHtml = `
                    <button class="card-btn danger" onclick="rejectOffer(${offer.id})">Ablehnen</button>
                    <button class="card-btn success" onclick="acceptOffer(${offer.id})">Annehmen</button>`;
            } else {
                actionsHtml = `<p>Warten auf Antwort des Käufers...</p>`;
            }
        } else if (offer.status === 'accepted') {
            actionsHtml = `<button class="card-btn primary" onclick="proceedToCheckout(${offer.id})" style="width: 100%;">Jetzt kaufen</button>`;
        } else {
            actionsHtml = `<button class="card-btn primary" onclick="viewProduct(${offer.product_id})" style="width: 100%;">Erneut verhandeln</button>`;
        }
        
        const discount = Math.round((1 - offer.offer_amount / offer.product_price) * 100);

        return `
            <div class="negotiation-card ${offer.status}">
                <div class="card-product">
                    <img src="${offer.product_image || 'https://via.placeholder.com/80x100?text=Bild'}" alt="${offer.product_name}" class="card-product-image">
                    <div class="card-product-info">
                        <div class="card-product-title">${offer.product_name}</div>
                        <div>
                            <span class="card-product-price">${offer.product_price.toFixed(2)}€</span>
                        </div>
                        <div class="seller-info">
                            <div class="seller-name">${isBuyer ? offer.seller_name : offer.buyer_name}</div>
                        </div>
                    </div>
                </div>
                <div class="card-offer">
                    <div class="offer-row">
                        <span class="offer-label">Status</span>
                        <span class="status-badge ${offer.status}">
                            ${statusIcons[offer.status]} ${statusLabels[offer.status]}
                        </span>
                    </div>
                    <div class="offer-row">
                        <span class="offer-label">Angebot</span>
                        <span class="offer-value highlight">
                            ${(offer.counter_amount || offer.offer_amount).toFixed(2)}€
                            <span class="offer-discount">-${discount}%</span>
                        </span>
                    </div>
                </div>
                <div class="card-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }

    function setupWebSockets() {
        sockets.forEach(socket => socket.close());
        sockets = [];
        
        const uniqueOfferIds = [...new Set(allOffers.map(o => o.id))];

        uniqueOfferIds.forEach(offerId => {
            const wsUrl = (api.baseURL.startsWith('https') ? 'wss://' : 'ws://') + api.baseURL.split('//')[1] + `/ws/offers/${offerId}`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => console.log(`WebSocket connected for offer ${offerId}`);
            ws.onmessage = (event) => {
                console.log(`Message for offer ${offerId}:`, event.data);
                fetchOffers();
                toast.info('Update', 'Eine Verhandlung wurde aktualisiert!');
            };
            ws.onerror = (error) => console.error(`WebSocket error for offer ${offerId}:`, error);
            ws.onclose = () => console.log(`WebSocket disconnected for offer ${offerId}`);
            
            sockets.push(ws);
        });
    }
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter = tab.dataset.filter;
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderOffers();
        });
    });

    if (authGate.isAuthenticated) {
        fetchOffers();
    } else {
        AuthGuard.redirectToLogin('pazarlik.html');
    }
});

async function acceptOffer(offerId) {
    await api.acceptOffer(offerId);
}

async function rejectOffer(offerId) {
    await api.declineOffer(offerId);
}

async function cancelOffer(offerId) {
    await api.declineOffer(offerId);
}

function openCounterModal(offerId) {
    // Implement modal logic
}

function proceedToCheckout(offerId){
    // Implement checkout logic
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}