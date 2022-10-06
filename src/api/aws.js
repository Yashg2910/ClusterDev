const {copyFile} = require('fs').promises;

const aws = {
  uploadFileFromDump: async (filename) => {
    try {
      copyFile(`dump/${filename}`, `uploads/${filename}`);
      console.log("file copied from dump to upload");
    } catch (e) {
      // Error handling for the upload
      console.error("Error upload file to aws", e);
    }
  }
}

module.exports = aws;