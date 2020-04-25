var express = require('express');
var router = express.Router();
// Require controller modules.
var calendar_controller = require('../controllers/calendarController');

/// BOOK ROUTES ///

// GET calendar display
router.get('/', calendar_controller.displayCalendar);



module.exports = router;