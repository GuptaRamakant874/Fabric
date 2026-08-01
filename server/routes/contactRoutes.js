const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { contactSubmitLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .get(protect, getContactMessages)
  .post(contactSubmitLimiter, submitContactMessage);

router.route('/:id')
  .put(protect, updateMessageStatus);

module.exports = router;
