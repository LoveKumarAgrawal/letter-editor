const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "https://letter-editor-backend-xi.vercel.app/auth/google/callback",
			scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
		},
		function (accessToken, refreshToken, profile, callback) {
			profile.accessToken = accessToken;
      		profile.refreshToken = refreshToken;
			return callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});