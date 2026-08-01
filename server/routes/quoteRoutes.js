const express = require('express');
const router = express.Router();
const {
  submitQuote,
  getQuotes,
  updateQuoteStatus,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');
const { quoteSubmitLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getQuotes)
  .post(quoteSubmitLimiter, upload.single('file'), submitQuote);

router.route('/:id')
  .put(protect, updateQuoteStatus);

module.exports = router;
