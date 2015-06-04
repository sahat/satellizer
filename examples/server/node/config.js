module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
  MONGO_URI: process.env.MONGO_URI || 'localhost',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '84e952da26fc9e7a12bbc32523efa8a0',
  FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '70jGjvrUAEOPlawWGPJYw-Dk',
  GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
  WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || 'Windows Live Secret',
  TWITTER_KEY: process.env.TWITTER_KEY || 'vdrg4sqxyTPSRdJHKu4UVVdeD',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA',
  TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'http://localhost:3000',
  YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
};