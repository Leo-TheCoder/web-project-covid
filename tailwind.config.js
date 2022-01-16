/** @format */

module.exports = {
	content: ["./views/**/*.hbs", "./public/**/*.js"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
