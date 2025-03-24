require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJson);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:process.env.BUCKET_STORAGE_URL,
});

const bucket = admin.storage().bucket();

/**
 * Uploads a file to Firebase Storage and returns the public URL.
 * @param {Object} file - The file object (e.g., from multer).
 * @param {string} folder - The folder in Firebase Storage where the file will be uploaded.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
const uploadFileToFirebase = async (file, folder = "shop-sphere/category-images") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Define the file path in Firebase Storage
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    // Create a write stream to upload the file
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Handle stream events
    return new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(`Unable to upload file: ${error}`);
      });

      blobStream.on("finish", async () => {
        // Make the file publicly accessible
        await fileUpload.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      // Write the file to Firebase Storage
      blobStream.end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

module.exports = { uploadFileToFirebase };