'use strict';

const express = require('express');

module.exports = dependencies => {
  const router = express.Router();

  router.use('/sendemail', require('./sendEmail')(dependencies));
  router.use('/identities', require('./identities')(dependencies));
  router.use('/forwardings', require('./forwardings')(dependencies));

  return router;
};
