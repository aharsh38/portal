var express = require('express');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var hbs = require('nodemailer-express-handlebars');
var _ = require('underscore');
var dotenv = require('dotenv');
dotenv.load();

var mailController = function() {
    function sendMails(xyz, subject, template) {

        _.each(xyz, function(element, index, list) {

            var send_grid = {
                auth: {
                    api_user: process.env.SENDGRID_USERNAME,
                    api_key: process.env.SENDGRID_PASSWORD
                }
            };

            var client = nodemailer.createTransport(sgTransport(send_grid));

            var options = {
                viewPath: './api/slips/templates/',
                extName: '.hbs'
            };

            client.use('compile', hbs(options));
            // console.log("ELEMENT EMAIL",list);
            var email_obj = {
                from: 'noreply@domain.com',
                to: element.email,
                subject: subject,
                template: template,
                context: {
                    name: element.name,
                    link: element.link
                }
            };

            client.sendMail(email_obj, function(err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info);
                }
            });
        });
    }

    var mc = {};
    mc.sendMails = sendMails;
    return mc;
};

module.exports = mailController;
// module.exports = mailController;
