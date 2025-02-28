const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  pasteId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  content: { 
    type: String, 
    required: true 
  },
  encrypted: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 2592000 // 30 days TTL
  },
  language: {
    type: String,
    default: 'plaintext'
  },
  views: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Paste', pasteSchema);