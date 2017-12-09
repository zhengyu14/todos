# To-do List
This is a RESTful web service built with hapi.js and MongoDB.

## Run MongoDB on docker on port 27017
$ docker run --name {instanceName} -p 27017:27017 -d mongo

## NPM Installation
hapi, mongodb

## HTTP Request Format
### Create a to-do item
POST: [http/https]://{hostName}:3000/create/{toDoTitle}

### Read all to-do items
GET: [http/https]://{hostName}:3000/read

### Update the status of a to-do item from NEW to COMPLETED
POST: [http/https]://{hostName}:3000/update/{toDoTitle}

### Delete a completed to-do item
DELETE: [http/https]://{hostName}:3000/delete/{toDoTitle}

### Query to-do items
GET: [http/https]://{hostName}:3000/query?title={toDoTitle}&status=[NEW/COMPLETED]
