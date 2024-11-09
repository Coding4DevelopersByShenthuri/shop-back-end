const FileModel = require('../models/fileModel');

const FileService = {
  async deleteFile(filePath) {
    // Check if the file exists before attempting deletion
    const fileExists = await FileModel.fileExists(filePath);
    if (!fileExists) {
      throw new Error('File not found');
    }
    
    // Delete the file using FileModel
    return await FileModel.deleteFile(filePath);
  }
};

module.exports = FileService;
