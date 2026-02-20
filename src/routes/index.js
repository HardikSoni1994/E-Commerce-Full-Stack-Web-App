const express = require('express');

const route = express.Router();

route.use('/auth', require('./auth/auth.route'));

module.exports = route;