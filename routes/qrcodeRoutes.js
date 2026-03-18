const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Route to generate QR code
router.get('/generate-qr', (req, res, next) => {
  const { url } = req.query;

  QRCode.toDataURL(url, (err, qrCodeData) => {
    if (err) return sendError(res, 'Error generating QR code', 500);

    sendSuccess(res, { qrCodeData }, 'QR code generated successfully');
  });
});

module.exports = router;
