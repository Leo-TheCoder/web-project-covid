const db = require('../db/connectDB');
let isServerInit = true;
const checkIfServerInit = async (req, res, next) => {
    if(!isServerInit) {
        return next();
    }

    const result = await db.query('select * from account limit 2');
    if(result.rowCount < 1) {
        isServerInit = true;
        return res.redirect('/register');
    }
    isServerInit = false;
    next();
}

module.exports = {
    checkIfServerInit
}