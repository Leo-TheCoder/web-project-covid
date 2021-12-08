//declaring public variables
const express = require("express");
const router = express.Router();

//get login page
router.get('/', function (req, res) {
	try {
	    res.render('login', {layout: "main"});
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;