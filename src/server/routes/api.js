const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Paste = require('../models/Paste');
const { encrypt, decrypt } = require('../utils/encryption');

router.post('/paste', async (req, res) => {
  try {
    const { content, language = 'plaintext' } = req.body;
    
    if (!content || content.length > process.env.MAX_PASTE_SIZE) {
      return res.status(400).json({ error: 'Invalid content length' });
    }

    const pasteId = crypto.randomBytes(6).toString('hex');
    const encryptedContent = encrypt(content);
    
    const paste = new Paste({
      pasteId,
      content: encryptedContent,
      language
    });
    
    await paste.save();
    res.json({ pasteId });
  } catch (error) {
    console.error('Create paste error:', error);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

router.get('/paste/:pasteId', async (req, res) => {
  try {
    const paste = await Paste.findOneAndUpdate(
      { pasteId: req.params.pasteId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    
    const decryptedContent = decrypt(paste.content);
    res.json({ 
      content: decryptedContent,
      language: paste.language,
      views: paste.views,
      createdAt: paste.createdAt
    });
  } catch (error) {
    console.error('Retrieve paste error:', error);
    res.status(500).json({ error: 'Failed to retrieve paste' });
  }
});

module.exports = router;