var _und = require('underscore');
// var eventSections = require('../config/eventList').event_sections;
var fs = require('fs');

var eventController = function(Event) {

    function throwError(response, errorFor, error) {
        response.status(500);
        response.json({
            "error": {
                "message": "Internal Server Error",
                "for": errorFor,
                "original": error
            }
        });
    }

    function uploadDocs(request, response) {
        var temp_path = request.files.file.path;
        var target_path = './public/media/docs/' + request.files.file.originalFilename;
        fs.rename(temp_path, target_path, function(error) {
            if (error) {
                response.json(error);
            } else {
                var returnObject = {};
                returnObject.path = target_path.toString().slice(8);

                response.status(200).json(returnObject);
            }
        });
    }

    function uploadImage(request, response) {
        var temp_path = request.files.file.path;
        var target_path = './public/media/images/' + request.files.file.originalFilename;
        fs.rename(temp_path, target_path, function(error) {
            if (error) {
                response.json(error);
            } else {
                var returnObject = {};
                returnObject.path = 'http://portal.gtu.ac.in' + target_path.toString().slice(8);
                response.status(200).json(returnObject);
            }
        });
    }

    function getEventsBySection(req, res) {
        var event_classification = [];
        var event_classification_final = [];


        Event.aggregate(
            [{
                $group: {
                    _id: "$section",
                    events: {
                        $push: {
                            event_name: "$name",
                            do_payment: "$do_payment",
                            fees: "$fees",
                            fees_type: "$fees_type"
                        }
                    }
                }
            }],
            function(error, data) {
                if (error) {
                    throwError(response, "Finding all events according to section", error);
                } else {

                    event_classification = _und.indexBy(data, '_id');

                    for (var j in event_classification) {
                        event_classification_final.push({
                            section_name: event_classification[j]['_id'],
                            events: event_classification[j]['events']
                        });
                    }
                    res.json(event_classification_final);
                }
            });
    }


    function getAllEvents(request, response) {
        Event.find(function(error, events) {
            if (error) {
                throwError(response, "Finding All Events", error);
            } else {
                response.status(200);
                response.json(events);
            }
        });
    }

    function createEvent(request, response) {
        var event_obj = new Event();
        // event_obj = request.body;
        event_obj.name = request.body.name;
        event_obj.tagline = request.body.tagline;
        event_obj.description = request.body.description;
        event_obj.rules = request.body.rules;
        event_obj.specification = request.body.specification;
        event_obj.problem_statement = request.body.problem_statement;
        event_obj.judging_criteria = request.body.judging_criteria;
        event_obj.managers = request.body.managers;
        event_obj.section = request.body.section;
        event_obj.main_section = request.body.main_section;
        event_obj.fixed_payment = request.body.fixed_payment;
        event_obj.keywords = request.body.keywords;
        event_obj.no_of_participants = request.body.no_of_participants;
        event_obj.fees = request.body.fees;
        event_obj.fees_type = request.body.fees_type;
        event_obj.shortcode = request.body.shortcode;
        event_obj.event_image = request.body.event_image;
        event_obj.save(function(error) {
            if (error) {
                throwError(response, "Creating Event", error);
            } else {
                response.status(201);
                response.json(event_obj);
            }
        });

    }

    function getSingleEvent(request, response) {
        if (request.event) {
            response.status(200);
            response.json(request.event);
        }
    }

    function updateEvent(request, response) {
        request.event.name = request.body.name;
        request.event.tagline = request.body.tagline;
        request.event.description = request.body.description;
        request.event.rules = request.body.rules;
        request.event.specification = request.body.specification;
        request.event.problem_statement = request.body.problem_statement;
        request.event.judging_criteria = request.body.judging_criteria;
        request.event.managers = request.body.managers;
        request.event.section = request.body.section;
        request.event.main_section = request.body.main_section;
        request.event.fixed_payment = request.body.fixed_payment;
        request.event.keywords = request.body.keywords;
        request.event.no_of_participants = request.body.no_of_participants;
        request.event.fees = request.body.fees;
        request.event.fees_type = request.body.fees_type;
        request.event.event_image = request.body.event_image;
        request.event.shortcode = request.body.shortcode;
        request.event.save(function(error) {
            if (error) {
                throwError(response, "Updating Event", error);
            } else {
                response.status(200).json(request.Event);
            }
        });
    }

    function deleteEvent(request, response) {
        request.event.remove(function(error) {
            if (error) {
                throwError(response, "Deleting Event", error);
            } else {
                response.status(202).send({
                    "message": "Event Removed"
                });
            }
        });
    }

    function getEventsBySectionM(request, response) {
        var event_classification = [];
        var event_classification_final = [];

        Events.find({
            main_section: 'Technical Events'
        }).aggregate(
            [{
                $group: {
                    _id: "$section",
                    events: {
                        $push: {
                            event_name: "$name",
                            fixed_payment: "$fixed_payment",
                            fees: "$fees",
                            fees_type: "$fees_type",
                            no_of_participants: "$no_of_participants",
                            shortcode: "$shortcode",
                            id: "$_id"
                        }
                    }
                }
            }],
            function(error, data) {
                if (error) {
                    throwError(response, "Finding all events according to section", error);
                } else {

                    event_classification = _und.indexBy(data, '_id');

                    for (var j in event_classification) {
                        event_classification_final.push({
                            section_name: event_classification[j]['_id'],
                            events: event_classification[j]['events']
                        });
                    }
                    res.json(event_classification_final);
                }
            });
    }


    return {
        getAllEvents: getAllEvents,
        getEventsBySection: getEventsBySection,
        getEventsBySectionM: getEventsBySectionM,
        createEvent: createEvent,
        getSingleEvent: getSingleEvent,
        updateEvent: updateEvent,
        deleteEvent: deleteEvent,
        uploadDocs: uploadDocs,
        uploadImage: uploadImage
    };

};
module.exports = eventController;;
