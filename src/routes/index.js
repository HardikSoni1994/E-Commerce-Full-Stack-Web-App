const express = require('express');

const route = express.Router();

route.use('/auth', require('./auth/admin/admin.route'));
route.use('/auth', require('./auth/user/user.route'))

module.exports = route;