import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  footerText: {
    type: String,
    required: false
  },
  contactEmail: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  telegramChatId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', SiteSettingsSchema);