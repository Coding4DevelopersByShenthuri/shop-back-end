const express = require('express');
const FileService = require('./fileService');

const router = express.Router();

// DELETE route to delete a file
router.delete('/delete-file', async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ message: 'File path is required' });
  }

  try {
    // Delete the file through the FileService
    const result = await FileService.deleteFile(filePath);
    res.status(200).json({ message: result });
  } catch (error) {
    if (error.message === 'File not found') {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
