const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      return next(new Error('Please fill all required fields: name, email, message'));
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status (Read/Unread)
// @route   PUT /api/contact/:id
// @access  Private (Admin)
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Unread', 'Read'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status value. Must be Unread or Read.'));
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      res.status(404);
      return next(new Error('Message not found'));
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
};
