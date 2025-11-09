// ============================================
// PRODUCT REVIEWS SYSTEM
// CSS Berlin - Climate Smart Solutions
// ============================================

/**
 * Reviews Management System
 * - Add, edit, delete reviews
 * - 5-star rating system
 * - User verification
 * - localStorage based storage
 */

// ============================================
// ADD REVIEW
// ============================================

/**
 * Add a new review for a product
 * @param {string} productId - Product ID
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Review comment
 * @returns {object} - Review object or error
 */
function addReview(productId, rating, comment) {
    try {
        // Check if user is logged in
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('Sie müssen angemeldet sein, um eine Bewertung abzugeben.');
        }

        // Validate inputs
        if (!productId) {
            throw new Error('Produkt-ID ist erforderlich.');
        }

        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Bewertung muss zwischen 1 und 5 Sternen liegen.');
        }

        if (!comment || comment.trim().length < 10) {
            throw new Error('Kommentar muss mindestens 10 Zeichen lang sein.');
        }

        // Get existing reviews
        const reviews = JSON.parse(localStorage.getItem('cssberlin_reviews') || '[]');

        // Check if user already reviewed this product
        const existingReview = reviews.find(r =>
            r.productId === productId && r.userId === currentUser.id
        );

        if (existingReview) {
            throw new Error('Sie haben dieses Produkt bereits bewertet. Sie können Ihre Bewertung bearbeiten.');
        }

        // Create new review
        const newReview = {
            id: 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            productId: productId,
            userId: currentUser.id,
            userName: currentUser.firstName + ' ' + currentUser.lastName,
            userEmail: currentUser.email,
            rating: parseInt(rating),
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
            helpful: 0,
            reported: false
        };

        // Add to reviews
        reviews.push(newReview);
        localStorage.setItem('cssberlin_reviews', JSON.stringify(reviews));

        console.log('✅ Review added:', newReview.id);
        return { success: true, review: newReview };

    } catch (error) {
        console.error('❌ Add review error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// GET REVIEWS
// ============================================

/**
 * Get all reviews for a specific product
 * @param {string} productId - Product ID
 * @returns {array} - Array of reviews
 */
function getProductReviews(productId) {
    try {
        const reviews = JSON.parse(localStorage.getItem('cssberlin_reviews') || '[]');

        // Filter by product ID and sort by date (newest first)
        const productReviews = reviews
            .filter(r => r.productId === productId && !r.reported)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return productReviews;

    } catch (error) {
        console.error('❌ Get reviews error:', error);
        return [];
    }
}

/**
 * Get all reviews by a specific user
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {array} - Array of reviews
 */
function getUserReviews(userId = null) {
    try {
        const currentUser = getCurrentUser();
        const targetUserId = userId || (currentUser ? currentUser.id : null);

        if (!targetUserId) {
            return [];
        }

        const reviews = JSON.parse(localStorage.getItem('cssberlin_reviews') || '[]');

        // Filter by user ID and sort by date (newest first)
        const userReviews = reviews
            .filter(r => r.userId === targetUserId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return userReviews;

    } catch (error) {
        console.error('❌ Get user reviews error:', error);
        return [];
    }
}

/**
 * Get average rating for a product
 * @param {string} productId - Product ID
 * @returns {object} - { average, count }
 */
function getProductRating(productId) {
    try {
        const reviews = getProductReviews(productId);

        if (reviews.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviews.length;

        return {
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: reviews.length
        };

    } catch (error) {
        console.error('❌ Get rating error:', error);
        return { average: 0, count: 0 };
    }
}

// ============================================
// UPDATE REVIEW
// ============================================

/**
 * Update an existing review
 * @param {string} reviewId - Review ID
 * @param {number} rating - New rating
 * @param {string} comment - New comment
 * @returns {object} - Result object
 */
function updateReview(reviewId, rating, comment) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('Sie müssen angemeldet sein.');
        }

        // Validate inputs
        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Bewertung muss zwischen 1 und 5 Sternen liegen.');
        }

        if (!comment || comment.trim().length < 10) {
            throw new Error('Kommentar muss mindestens 10 Zeichen lang sein.');
        }

        // Get reviews
        const reviews = JSON.parse(localStorage.getItem('cssberlin_reviews') || '[]');
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);

        if (reviewIndex === -1) {
            throw new Error('Bewertung nicht gefunden.');
        }

        // Check ownership
        if (reviews[reviewIndex].userId !== currentUser.id) {
            throw new Error('Sie können nur Ihre eigenen Bewertungen bearbeiten.');
        }

        // Update review
        reviews[reviewIndex].rating = parseInt(rating);
        reviews[reviewIndex].comment = comment.trim();
        reviews[reviewIndex].updatedAt = new Date().toISOString();

        // Save
        localStorage.setItem('cssberlin_reviews', JSON.stringify(reviews));

        console.log('✅ Review updated:', reviewId);
        return { success: true, review: reviews[reviewIndex] };

    } catch (error) {
        console.error('❌ Update review error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// DELETE REVIEW
// ============================================

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {object} - Result object
 */
function deleteReview(reviewId) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('Sie müssen angemeldet sein.');
        }

        // Get reviews
        const reviews = JSON.parse(localStorage.getItem('cssberlin_reviews') || '[]');
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);

        if (reviewIndex === -1) {
            throw new Error('Bewertung nicht gefunden.');
        }

        // Check ownership (or admin)
        const isAdmin = currentUser.role === 'admin' ||
                       currentUser.email === 'admin@cssberlin.de' ||
                       currentUser.email === 'noreply@cssberlin.de';

        if (reviews[reviewIndex].userId !== currentUser.id && !isAdmin) {
            throw new Error('Sie können nur Ihre eigenen Bewertungen löschen.');
        }

        // Remove review
        reviews.splice(reviewIndex, 1);
        localStorage.setItem('cssberlin_reviews', JSON.stringify(reviews));

        console.log('✅ Review deleted:', reviewId);
        return { success: true };

    } catch (error) {
        console.error('❌ Delete review error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.addReview = addReview;
window.getProductReviews = getProductReviews;
window.getUserReviews = getUserReviews;
window.getProductRating = getProductRating;
window.updateReview = updateReview;
window.deleteReview = deleteReview;

console.log('✅ Reviews system loaded');
