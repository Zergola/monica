const { body,validationResult } = require('express-validator');
const validator = require('validator');
//Create a SomeModel model just by requiring the module
var Event = require('../models/events');

exports.createEvent_get = function(req, res) {

    res.render('event', { title: 'Event creation' });
};

exports.displayEvent = function(req, res) {

  Event.findById(req.params.id, function(err, found_id) {
      if (err) { return next(err); }

      if (found_id) {
        // Event exists, redirect to its detail page.
        
        // to update the found mongoose document
        // found_id.title = "trouvé";
        // found_id.save();

        for (label in found_id) {
          if (found_id[label] !== undefined && typeof found_id[label] === 'string' ) {validator.unescape(found_id[label]);}
        }

        found_id.title = validator.unescape(found_id.title);
        if (found_id.notes !== undefined) {found_id.notes = validator.unescape(found_id.notes);} ;
       
        res.render('event', {title : 'Event Details', body:found_id} )
      }

      else {
        // Event doesn't exists
        res.send('Not implemented : This event does not exist.');
      }
    })
};

// Handle Genre create on POST.
exports.createEvent_post =  [
    // Validate that the name field is not empty.
    //body('title').trim().isLength({ min: 1 }),
    // Sanitize (escape) the name field.
    //body('*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

      // Create a genre object with escaped and trimmed data.
      var event = new Event(newEventParametersFromPostedInfo(req));
/*       var event = new Event(
        { title: req.body.title,
          notes:req.body.notes,
          startDate:req.body.startDate,
          endDate:req.body.endDate
         }
      ); */
      
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Event.findOne({ 'title': req.body.title, 'startDate':req.body.startDate })
          .exec( function(err, docs) {
             if (err) { return next(err); }
  
             if (docs) {
               // Event exists, redirect to its detail page.
               res.send('Events already exists please modify the first one : ' + docs.url)
             }
             else {
  
               event.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect('/calendar');
               });
  
              }
  
           });
      }

  ];


exports.updateEvent_post = function(req, res,next) {
  var event = newEventParametersFromPostedInfo(req);
  console.log(event);
  //TO DO : check if user has the right to do it
  Event.findByIdAndUpdate(req.params.id,event)
  .exec( function(err, found_id) {
      if (err) { return next(err); }

      if (found_id) {
        // Event exists, redirect to its detail page.
        console.log('event updated' + req.body.title)
        res.redirect('/calendar');
      }
  });


}

exports.deleteEvent = function(req, res,next) {
  if(req.params.id === req.body.id) {
    Event.findByIdAndDelete(req.params.id)
    .exec( function(err, found_id) {
        if (err) { return next(err); }
  
        if (found_id) {
          // Event exists, redirect to its detail page.
          console.log('event deleted');
          res.redirect('/calendar');
        }
    });
  }
  else{ res.send('an error occured.')}
}

exports.checkEventDataCompliance = async function(req,res,next){ //check posted data and check if compliant

  await body('title').isLength({ min: 1 }).withMessage('Title must be filled').escape().run(req);
  await body('endDate').isAfter(req.body.startDate).withMessage('endDate Must be after the startDate').run(req);
  await body('notes').escape().run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    
next();
}


var newEventParametersFromPostedInfo = function(req,res){
  var event = {
      title: req.body.title,
      notes:req.body.notes,
      startDate:req.body.startDate,
      endDate:req.body.endDate
     }
  ;

  return event;
}

exports.diplayEventList = function(req,res){
// list the user events
  let eventList;
  let EventQuery = Event.find(null,'title').sort({ startDate: 1 }).exec( function(err, eventList) {
    if (err) { return next(err); }

    if (eventList) {
      console.log(eventList);
      for (i in eventList) {
      eventList[i].title = validator.unescape(eventList[i].title);
      }
      res.render('eventList',{title:'Event List',eventList:eventList})
    }
  });
}