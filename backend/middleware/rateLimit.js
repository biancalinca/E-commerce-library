// middleware/rateLimiter.js
const attemptLimits = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const loginLimiter = (req, res, next) => {
    const ip = req.ip;
    
    if (!attemptLimits[ip]) {
        attemptLimits[ip] = { attempts: 0, lastAttempt: Date.now() };
    }

    const currentTime = Date.now();
    const timePassed = currentTime - attemptLimits[ip].lastAttempt;

    if (timePassed > WINDOW_MS) {
        // Reset attempts after the time window has passed
        attemptLimits[ip].attempts = 0;
    }

    attemptLimits[ip].lastAttempt = currentTime;

    if (attemptLimits[ip].attempts >= MAX_ATTEMPTS) {
        console.log('Rate limit reached for login');
        return res.status(429).json({
            message: 'Prea multe încercări de autentificare, te rugăm să încerci din nou după 5 minute.',
            error: true,
            success: false
        });
    }

    attemptLimits[ip].attempts += 1;
    next();
};

const resetLoginAttempts = (ip) => {
    if (attemptLimits[ip]) {
        attemptLimits[ip].attempts = 0;
    }
};

module.exports = {
    loginLimiter,
    resetLoginAttempts
};
