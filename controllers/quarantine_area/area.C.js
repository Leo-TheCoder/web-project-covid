const Area = require('../../models/Area.M');

const getArea = async (req, res) => {
	const result = await Area.getArea();
	res.json(result);
};

module.exports = { getArea };
