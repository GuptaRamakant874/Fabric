const rateLimit = require('express-rate-limit');

// Rate limiter for quote request form submissions
const quoteSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP to 10 quote requests per hour
  message: {
    success: false,
    message: 'Too many quote requests submitted from this IP. Please try again after an hour.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for contact form submissions
const contactSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 15, // Limit each IP to 15 contact messages per hour
  message: {
    success: false,
    message: 'Too many contact messages sent from this IP. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  quoteSubmitLimiter,
  contactSubmitLimiter,
};
