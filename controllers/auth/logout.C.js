const logout = (req, res) => {
	res.cookie('authorization', 'off', { expire: "Wed, 22 Dec 1900 14:42:15 GMT" });
	res.redirect('/');
}

module.exports = {
	logout,
};
