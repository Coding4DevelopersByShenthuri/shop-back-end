const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.delete('/delete-file', (req, res) => {
  const { filePath } = req.body; 
  if (!filePath) {
    return res.status(400).json({ message: 'File path is required' });
  }
  
  fs.rm(filePath, { recursive: true, force: true }, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete file' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
});
