'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

 // Connection URL
var url = 'mongodb://localhost:27017/test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server at: ", url);

  var todoCollection = db.collection('documents');

  // Create a new todo item
  server.route({
      method: 'POST',
      path:'/create',
      handler: function (request, reply) {
          // Insert a single document
          db.todoCollection('inserts').insertOne({a:1}, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);

            db.cloase();
          });
      }
  });

  // Get a list of todos
  server.route({
      method: 'GET',
      path:'/showall',
      handler: function (request, reply) {
          // Find all documents
          db.collection('find').find({}).toArray(function(err, docs) {
            assert.equal(null, err);
            db.close();
          })
          return 'hello world';
      }
  });

  db.close();
});



// Delete a completed todo item
server.route({
    method: 'DELETE',
    path:'/delete/{id}',
    handler: function (request, reply) {

        return 'hello world';
    }
});

// Update a todo item
server.route({
    method: 'POST',
    path:'/update',
    handler: function (request, reply) {

        return 'hello world';
    }
});

// Search for a todo item
server.route({
    method: 'GET',
    path:'/search',
    handler: function (request, reply) {

        return 'hello world';
    }
});

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
