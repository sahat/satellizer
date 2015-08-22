module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'JWT Token Secret',
  MONGO_URI: process.env.MONGO_URI || 'localhost',

  // OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '',
  FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || '',
  TWITCH_SECRET: process.env.TWITCH_SECRET || '',
  WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || '',
  YAHOO_SECRET: process.env.YAHOO_SECRET || '',

  // OAuth 1.0
  TWITTER_KEY: process.env.TWITTER_KEY || '',
  TWITTER_SECRET: process.env.TWITTER_SECRET || ''
};