const Audit = require("../models/Audit.M")
const audit = (req, res, next) => {
    const fullUrl = req.baseUrl + req.url;
    const method = req.method;
    const accountid = req.user.id;

    if(method !== 'GET'){
        Audit.audit(accountid, fullUrl, method);
    }

    next();
};

module.exports = audit;
