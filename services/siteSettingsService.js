import SiteSettings from '../models/SiteSettings.js';

export const getSiteSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings({});
    await settings.save();
  }
  return settings;
};

export const updateSiteSettings = async (footerText, contactEmail, phone, telegramChatId) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings({});
  }
  settings.footerText = footerText || settings.footerText;
  settings.contactEmail = contactEmail || settings.contactEmail;
  settings.phone = phone || settings.phone;
  settings.telegramChatId = telegramChatId || settings.telegramChatId;
  await settings.save();
  return settings;
};