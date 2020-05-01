var express = require('express');
var router = express.Router();
var {body} = require('express-validator');
// Require controller modules.
var event_controller = require('../controllers/eventController');

/// BOOK ROUTES ///

// GET calendar display

router.get('/', event_controller.diplayEventList);
router.post('/create',event_controller.checkEventDataCompliance, event_controller.createEvent_post);
router.get('/create', event_controller.createEvent_get);
router.get('/:id', event_controller.displayEvent);
router.post('/:id',event_controller.checkEventDataCompliance, event_controller.updateEvent_post);
router.post('/:id/delete', event_controller.deleteEvent);
module.exports = router;