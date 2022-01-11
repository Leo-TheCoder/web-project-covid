const Area = require('../../models/Area.M');
const {CustomError} = require('../../errors');
const { StatusCodes } = require('http-status-codes');

const getArea = async (req, res) => {
	const result = await Area.getArea();

	if(!result)
	{
		throw new CustomError("Something wrong when getting areas!");
	}
	res.status(StatusCodes.OK).render('areas/areas', {
		areas: result,
		user: true,
	})
};

module.exports = { getArea };
