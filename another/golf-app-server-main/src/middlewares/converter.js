const fs = require('fs').promises;
const path = require('path');
const convert = require('heic-convert');

const convertHeicToPngMiddleware = (UPLOADS_FOLDER) => {
  
  return async (req, res, next) => {
    // Check if req.file is present
    if (req.file && (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif')) {
      const heicBuffer = await fs.readFile(req.file.path);
      const pngBuffer = await convert({
        buffer: heicBuffer,
        format: 'PNG'
      });

      const originalFileName = path.basename(req.file.originalname, path.extname(req.file.originalname));
      const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, ''); // Format current date and time
      const pngFileName = `${originalFileName}_${currentDateTime}.png`; // Add current date and time to file name
      const pngFilePath = path.join(UPLOADS_FOLDER, pngFileName);

      await fs.writeFile(pngFilePath, pngBuffer);

      // Remove the original HEIC file
      await fs.unlink(req.file.path);

      // Update file properties
      req.file.path = pngFilePath;
      req.file.filename = pngFileName;
      req.file.mimetype = 'image/png';
    }

    next();
  }
};

module.exports = convertHeicToPngMiddleware;


// const convertHeicToPngMiddleware = (UPLOADS_FOLDER) => {
//   return async (req, res, next) => {
//     try {
//       // Check if there is an image or coverImage field
//       const filesToConvert = ['image', 'coverImage'];

//       for (let field of filesToConvert) {
//         if (req.files[field] && req.files[field][0].mimetype === 'image/heic') {
//           const file = req.files[field][0];
//           const heicBuffer = await fs.readFile(file.path);
//           const pngBuffer = await convert({
//             buffer: heicBuffer,
//             format: 'PNG'
//           });

//           const originalFileName = path.basename(file.originalname, path.extname(file.originalname));
//           const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, ''); // Format current date and time
//           const pngFileName = `${originalFileName}_${currentDateTime}.png`; // Add current date and time to file name
//           const pngFilePath = path.join(UPLOADS_FOLDER, pngFileName);

//           await fs.writeFile(pngFilePath, pngBuffer);
//           await fs.unlink(file.path); // Delete the original HEIC file

//           // Update the file information to point to the converted PNG
//           file.path = pngFilePath;
//           file.filename = pngFileName;
//           file.mimetype = 'image/png';
//         }
//       }

//       next();
//     } catch (error) {
//       next(error); // Pass error to the next middleware
//     }
//   };
// };
// module.exports = convertHeicToPngMiddleware;
// const fs = require('fs').promises;
// const path = require('path');
// const convert = require('heic-convert');

// const convertHeicToPngMiddleware = (UPLOADS_FOLDER) => {
//   return async (req, res, next) => {
//     try {
//       // Files to check for HEIC format (image and coverImage)
//       const filesToConvert = ['image', 'coverImage'];

//       for (let field of filesToConvert) {
//         // Check if files for 'image' or 'coverImage' exist and are in HEIC format
//         if (req.files[field] && req.files[field][0].mimetype === 'image/heic') {
//           const file = req.files[field][0];

//           // Read the HEIC file buffer
//           const heicBuffer = await fs.readFile(file.path);
          
//           // Convert HEIC to PNG
//           const pngBuffer = await convert({
//             buffer: heicBuffer,
//             format: 'PNG'
//           });

//           // Generate new PNG file name with timestamp
//           const originalFileName = path.basename(file.originalname, path.extname(file.originalname));
//           const currentDateTime = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, ''); // Format current date and time
//           const pngFileName = `${originalFileName}_${currentDateTime}.png`; // Add current date and time to file name
//           const pngFilePath = path.join(UPLOADS_FOLDER, pngFileName);  // Destination path for the new PNG file

//           // Write the PNG buffer to the disk
//           await fs.writeFile(pngFilePath, pngBuffer);
          
//           // Remove the original HEIC file from the server
//           await fs.unlink(file.path);

//           // Update the file information with the new PNG file details
//           file.path = pngFilePath;
//           file.filename = pngFileName;
//           file.mimetype = 'image/png'; // Update MIME type
//         }
//       }

//       next(); // Continue to the next middleware
//     } catch (error) {
//       next(error); // Pass error to the next middleware (e.g., error handling middleware)
//     }
//   };
// };

// module.exports = convertHeicToPngMiddleware;
