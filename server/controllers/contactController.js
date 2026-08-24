const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

const sendContactEmail = async (messageData) => {
  const isEmailConfigured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.ADMIN_EMAIL
  );

  if (!isEmailConfigured) {
    console.log('\n=========================================');
    console.log('[CONTACT EMAIL MOCK] SMTP configuration not set. Console Log Details:');
    console.log(`TO: ${process.env.ADMIN_EMAIL || 'admin@fabsteel.com'}`);
    console.log(`SUBJECT: New Contact Message from ${messageData.name}`);
    console.log(`BODY:
      Name: ${messageData.name}
      Email: ${messageData.email}
      Phone: ${messageData.phone || 'N/A'}
      Message: ${messageData.message}
    `);
    console.log('=========================================\n');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Metal Fab Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: messageData.email,
      subject: `[New Contact Message] ${messageData.name}`,
      html: `
        <h2>New Contact Message</h2>
        <hr />
        <p><strong>Name:</strong> ${messageData.name}</p>
        <p><strong>Email:</strong> ${messageData.email}</p>
        <p><strong>Phone:</strong> ${messageData.phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 10px; border-radius: 4px;">${messageData.message}</p>
        <br />
        <p>This message was sent from the website contact form.</p>
      `,
    });

    console.log(`Contact notification email successfully sent to admin: ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Nodemailer error sending contact message email:', error.message);
  }
};

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

    sendContactEmail(newMessage);

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
