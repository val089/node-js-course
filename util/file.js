const fs = require('fs');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(`Error deleting file: ${err.message}`);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
};

exports.deleteFile = deleteFile;
