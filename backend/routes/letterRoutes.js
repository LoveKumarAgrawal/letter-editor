const router = require("express").Router();
const { google } = require("googleapis");
const passport = require("passport");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: true, message: "Not authenticated" });
};

// Save content to Google Drive as Google Doc
router.post("/save", isAuthenticated, async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ error: true, message: "Content is required" });
    }

    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Step 1: Check if "Letters" folder exists
    const folderResponse = await drive.files.list({
      q: "name='Letters' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name)",
    });

    let folderId;
    if (folderResponse.data.files.length === 0) {
      // Step 2: Create "Letters" folder if not found
      const folderMetadata = {
        name: "Letters",
        mimeType: "application/vnd.google-apps.folder",
      };
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: "id",
      });
      folderId = folder.data.id;
    } else {
      folderId = folderResponse.data.files[0].id;
    }

    // Step 3: Save document as Google Docs inside "Letters" folder
    const fileMetadata = {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    };

    const media = {
      mimeType: "text/html", // Save HTML content as Google Docs
      body: content,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name, webViewLink",
    });

    res.status(200).json({
      success: true,
      file: response.data,
    });
  } catch (error) {
    console.error("Error saving to Google Drive:", error);
    res.status(500).json({ error: true, message: "Failed to save to Google Drive" });
  }
});


// Get list of saved letters from "Letters" folder
router.get("/list", isAuthenticated, async (req, res) => {
  try {
    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Step 1: Get "Letters" folder ID
    const folderResponse = await drive.files.list({
      q: "name='Letters' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id)",
    });

    if (folderResponse.data.files.length === 0) {
      return res.status(404).json({ files: [] });
    }

    const folderId = folderResponse.data.files[0].id;

    // Step 2: Get all documents from "Letters" folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, webViewLink)",
    });

    res.status(200).json({ files: response.data.files });
  } catch (error) {
    console.error("Error fetching letters:", error);
    res.status(500).json({ error: true, message: "Failed to retrieve letters" });
  }
});


// View a specific letter from Google Drive
router.get("/view/:id", isAuthenticated, async (req, res) => {
  try {
    const fileId = req.params.id;

    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Get file metadata
    const file = await drive.files.get({
      fileId,
      fields: "id, name, webViewLink",
    });

    res.status(200).json({
      success: true,
      file: file.data,
    });
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ error: true, message: "Failed to fetch letter" });
  }
});

module.exports = router;