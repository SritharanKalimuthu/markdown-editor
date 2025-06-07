import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Create Folder
export const createFolder = async (folderName) => {
  const res = await drive.files.create({
    resource: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return res.data.id;
};

// Upload File
export const uploadFile = async (fileName, filePath, folderId) => {
  const res = await drive.files.create({
    resource: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'text/markdown',
      body: fs.createReadStream(filePath),
    },
    fields: 'id, webViewLink',
  });

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return res.data;
};

// List Files in Folder
export const listFilesInFolder = async (folderId) => {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, webViewLink)',
  });

  return res.data.files;
};

// Get File
// export const getFile = async (fileId) => {
//   const res = await drive.files.get(
//     { fileId, alt: 'media' },
//     { responseType: 'stream' }
//   );

//   return new Promise((resolve, reject) => {
//     let fileData = '';

//     res.data.on('data', (chunk) => {
//       fileData += chunk;
//     });

//     res.data.on('end', () => {
//       resolve(fileData); 
//     });

//     res.data.on('error', (err) => {
//       reject(err);
//     });
//   });
// };
export const getFile = async (fileId) => {

  const metadataRes = await drive.files.get({
    fileId,
    fields: 'name'
  });
  
  const fileName = metadataRes.data.name;

  const res = await drive.files.get({
    fileId,
    alt: 'media',
  });

  return {
    file: res.data,
    fileName: fileName
  }
};



// Download File
export const downloadFile = async (fileId, destinationDir = './') => {
  const metaRes = await drive.files.get({
    fileId,
    fields: 'name',
  });

  const fileName = metaRes.data.name;
  const destinationPath = path.join(destinationDir, fileName);

  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(destinationPath);
    res.data
      .on('end', () => resolve(destinationPath))
      .on('error', reject)
      .pipe(dest);
  });
};

// Update File Content
export const updateFile = async (fileId, newFilePath, newFileName = null) => {
  const updatePayload = {
    fileId,
    media: {
      mimeType: 'text/markdown',
      body: fs.createReadStream(newFilePath),
    },
    requestBody: {},
  };

  if (newFileName) {
    updatePayload.requestBody.name = newFileName;
  }

  const res = await drive.files.update(updatePayload);
  return res.data;
};

// Rename File
export const renameFile = async (fileId, newFileName) => {
  const res = await drive.files.update({
    fileId,
    requestBody: {
      name: newFileName,
    },
  });

  return res.data;
};


// Delete File
export const deleteFile = async (fileId) => {
  await drive.files.delete({ fileId });
  return true;
};

// Delete Folder
export const deleteFolder = async (folderId) => {
  await drive.files.delete({ fileId: folderId });
  return true;
};

// Search File by Name (in whole drive or inside folder)
export const searchFileByName = async (fileName, folderId = null) => {
  let query = `name = '${fileName}' and trashed = false`;
  if (folderId) query += ` and '${folderId}' in parents`;

  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name, webViewLink)',
  });

  return res.data.files;
};
