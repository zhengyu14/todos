'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function(server, options, next) {

  const db = server.app.db;

  //PLACEHOLDER
  //--------------------------------------------------------------
  //Here the routes definitions will be inserted in the next steps...

  server.route({
      method: 'POST',
      path: '/books',
      handler: function (request, reply) {

          const book = request.payload;

          //Create an id
          book._id = uuid.v1();

          db.books.save(book, (err, result) => {

              if (err) {
                  return reply(Boom.wrap(err, 'Internal MongoDB error'));
              }

              reply(book);
          });
      },
      config: {
          validate: {
              payload: {
                  title: Joi.string().min(10).max(50).required(),
                  author: Joi.string().min(10).max(50).required(),
                  isbn: Joi.number()
              }
          }
      }
  });


  return next();
};

exports.register.attributes = {
  name: 'routes-todos'
};
