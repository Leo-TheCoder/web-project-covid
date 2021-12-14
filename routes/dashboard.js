const express = require('express');
const router = express.Router();

const {getAdminPage, getManagerPage, getUserPage} = require('../controllers/users/dashboard.C');

router.route('/admin').get(getAdminPage);
router.route('/user').get(getUserPage);
router.route('/manager').get(getManagerPage);

module.exports = router;