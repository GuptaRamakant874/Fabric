const QuoteRequest = require('../models/QuoteRequest');
const cloudinary = require('../config/cloudinary');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

// Helper to send email notification to admin
const sendQuoteEmail = async (quoteData) => {
  const isEmailConfigured = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.ADMIN_EMAIL
  );

  if (!isEmailConfigured) {
    console.log('\n=========================================');
    console.log('[EMAIL NOTIFICATION MOCK] SMTP configuration not set. Console Log Details:');
    console.log(`TO: ${process.env.ADMIN_EMAIL || 'admin@fabsteel.com'}`);
    console.log(`SUBJECT: New Quote Request from ${quoteData.name} - ${quoteData.projectType}`);
    console.log(`BODY:
      Client: ${quoteData.name} (${quoteData.company || 'No Company'})
      Email: ${quoteData.email} | Phone: ${quoteData.phone || 'N/A'}
      Project Type: ${quoteData.projectType}
      Budget: ${quoteData.budgetRange || 'N/A'}
      Timeline: ${quoteData.timeline || 'N/A'}
      Description: ${quoteData.description}
      Attachment URL: ${quoteData.fileUrl || 'None'}
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

    const mailOptions = {
      from: `"Metal Fab Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[New Quote Request] ${quoteData.projectType} - ${quoteData.name}`,
      html: `
        <h2>New Metal/Steel Fabrication Quote Request</h2>
        <hr />
        <p><strong>Client Name:</strong> ${quoteData.name}</p>
        <p><strong>Company:</strong> ${quoteData.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        <p><strong>Phone:</strong> ${quoteData.phone || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${quoteData.projectType}</p>
        <p><strong>Budget Range:</strong> ${quoteData.budgetRange || 'N/A'}</p>
        <p><strong>Timeline:</strong> ${quoteData.timeline || 'N/A'}</p>
        <p><strong>Project Description:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 10px; border-radius: 4px;">${quoteData.description}</p>
        ${quoteData.fileUrl ? `<p><strong>Uploaded Blueprint/Specs:</strong> <a href="${quoteData.fileUrl}" target="_blank">Download Attachment</a></p>` : '<p><strong>Attachment:</strong> None uploaded</p>'}
        <br />
        <p>This message was sent from the online quote request portal.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email successfully sent to admin: ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Nodemailer error sending quote request email:', error.message);
  }
};

// @desc    Submit a quote request
// @route   POST /api/quotes
// @access  Public
const submitQuote = async (req, res, next) => {
  try {
    const { name, company, email, phone, projectType, description, budgetRange, timeline } = req.body;

    let fileUrl = '';
    if (req.file) {
      if (cloudinary.isConfigured) {
        try {
          fileUrl = await cloudinary.uploadFile(req.file.path, 'quotes');
          await fs.unlink(req.file.path);
        } catch (error) {
          console.error('Cloudinary upload failed for quote file, keeping local:', error);
          fileUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        fileUrl = `/uploads/${req.file.filename}`;
      }
    }

    const quote = await QuoteRequest.create({
      name,
      company,
      email,
      phone,
      projectType,
      description,
      fileUrl,
      budgetRange,
      timeline,
    });

    // Trigger async email notification
    sendQuoteEmail(quote);

    res.status(201).json({ success: true, message: 'Quote request submitted successfully', data: quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quote requests
// @route   GET /api/quotes
// @access  Private (Admin)
const getQuotes = async (req, res, next) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote request status
// @route   PUT /api/quotes/:id
// @access  Private (Admin)
const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['New', 'Reviewed', 'Contacted'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status value'));
    }

    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      res.status(404);
      return next(new Error('Quote request not found'));
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuote,
  getQuotes,
  updateQuoteStatus,
};
