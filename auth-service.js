/**
 * Authentication Service
 * Handles authentication-related functionality across the website
 */

// Base API URL
const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:jyotHfBB';

// Auth token storage key
const AUTH_TOKEN_KEY = 'authToken';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid auth token
 */
function isAuthenticated() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

/**
 * Get the authentication token
 * @returns {string|null} The auth token or null if not available
 */
function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set the authentication token
 * @param {string} token - The auth token to save
 */
function setAuthToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear the authentication token (logout)
 */
function clearAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response from login API
 */
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        if (data.authToken) {
            setAuthToken(data.authToken);
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response from signup API
 */
async function register(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Logout the current user
 */
function logout() {
    clearAuthToken();
    window.location.href = 'login.html';
}


function updateAuthUI() {
    const isLoggedIn = isAuthenticated();
    const authLinks = document.querySelector('.auth-links');
    
    if (!authLinks) return;
    
    if (isLoggedIn) {
        // Check if we're on mobile
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Simplified mobile version
            authLinks.innerHTML = `
                <a href="#" class="logout-btn" id="logoutBtn">Logout</a>
            `;
        } else {
            // Desktop version with dropdown
            authLinks.innerHTML = `
                <div class="user-profile">
                    <span class="user-greeting">Welcome!</span>
                    <div class="user-dropdown">
                        <ul>
                            <li><a href="#" id="logoutBtn">Logout</a></li>
                        </ul>
                    </div>
                </div>
            `;
        }
        
        // Add event listener for the logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show confirmation dialog
                if (confirm('Are you sure you want to log out?')) {
                    // Show logout success message
                    const messageElement = document.createElement('div');
                    messageElement.className = 'logout-message';
                    messageElement.textContent = 'Logging out...';
                    document.body.appendChild(messageElement);
                    
                    // Simulate a short delay to show the message
                    setTimeout(() => {
                        logout();
                    }, 800);
                }
            });
        }
        
        // Toggle dropdown on click (desktop only)
        if (!isMobile) {
            const userProfile = document.querySelector('.user-profile');
            if (userProfile) {
                userProfile.addEventListener('click', function(e) {
                    if (!e.target.closest('#logoutBtn')) {
                        this.classList.toggle('active');
                    }
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!userProfile.contains(e.target)) {
                        userProfile.classList.remove('active');
                    }
                });
            }
        }
    } else {
        // Check if we're on mobile
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Simplified mobile version - just show register button
            authLinks.innerHTML = `
                <a href="register.html" class="register-btn">Join</a>
            `;
        } else {
            // Desktop version with both buttons
            authLinks.innerHTML = `
                <a href="login.html" class="login-btn">Sign In</a>
                <a href="register.html" class="register-btn">Join Now</a>
            `;
        }
    }
}

// Add a window resize listener to update the UI when switching between mobile and desktop
window.addEventListener('resize', function() {
    updateAuthUI();
});

// Run this when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});