const fs = require('fs').promises;

const FileModel = {
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return 'File deleted successfully';
    } catch (error) {
      throw new Error('Error deleting file');
    }
  }
};

module.exports = FileModel;
