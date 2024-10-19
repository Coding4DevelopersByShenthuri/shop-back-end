const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Route to generate QR code
router.get('/generate-qr', (req, res) => {
  const { url } = req.query;

  QRCode.toDataURL(url, (err, qrCodeData) => {
    if (err) return res.status(500).json({ error: 'Error generating QR code' });

    res.json({ qrCodeData });
  });
});

module.exports = router;
