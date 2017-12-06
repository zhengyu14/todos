'use strict';

const uuidv1 = require('uuid/v1');
const Hapi = require('hapi');
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
 });

// MongoDB service URL
const url = 'mongodb://localhost:27017/test';

// Create a new todo item (OK)
server.route({
  method: 'POST',
  path:'/create/{title}',
  handler: function (request, reply) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var database = db.db("todos");
      var newTodo = {
        title:encodeURIComponent(request.params.title)
        , status:"NEW"
      }
      // Insert a single document
      database.collection("todos").insertOne(newTodo, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        console.log(r);
      });
    });

    var response = "New to-do item created: "
      + encodeURIComponent(request.params.title)
      + ", with status: NEW.";
    return response;
  }
});

// Get a list of todos
server.route({
  method: 'GET',
  path:'/findall',
  handler: function (request, reply) {
    var response;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var database = db.db("todos");
      // Insert a single document
      database.collection("todos").find({}).toArray(function(err, r) {
        assert.equal(null, err);
        console.log(r);
      });
    });
    return response;
  }
});

// Delete a completed todo item (OK)
server.route({
  method: 'DELETE',
  path:'/delete/{title}',
  handler: function (request, reply) {
    var target = {
      title:encodeURIComponent(request.params.title),
      status:'COMPLETED'
    };

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var database = db.db("todos");
      var target = {
        uuid:encodeURIComponent(request.params.uuid)
        , status:'COMPLETED'
      };
      // Find and delete
      database.collection("todos").findOneAndDelete(target, function(err, r) {
        assert.equal(null, err);
      });
    });

    var response = "To-do item: " + encodeURIComponent(request.params.title) + " is deleted."
    return response;
    }
});

// Update a todo item to completed status
server.route({
  method: 'POST',
  path:'/update/{title}',
  handler: function (request, reply) {

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var database = db.db("todos");
      var target = {
        title: encodeURIComponent(request.params.title)
        , status: "NEW"
      };
      var updateInfo = {
        $set:{
          status: "COMPLETED"
        }
      };
      // Update
      database.collection("todos").updateOne(target, updateInfo, function(err, r) {
        assert.equal(null, err);
      });
    });

    var response = "To-do item: " + encodeURIComponent(request.params.title) + " is completed.";
    return response;
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
