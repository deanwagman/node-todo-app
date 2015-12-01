var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.send('Todo: API root');
});

// GET - /todos
app.get('/todos', function(request, response) {
	var queryParams = request.query;
	var localTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		localTodos = localTodos.filter((todo) => todo.completed === true);
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		localTodos = localTodos.filter((todo) => todo.completed === false);
	}

	response.json(localTodos);
});

// POST
app.post('/todos', function(request, response) {
	var body = request.body;
	var todo = {};

	if (typeof body.completed !== 'boolean' || typeof body.description !== 'string' || body.description.trim().length === 0) {
		return response.status(400).send()
	}

	todo = {
		description: body.description.trim(),
		completed: body.completed,
		id: todoNextId++
	};

	todos.push(todo);

	response.json(todo);
});

// GET - /todos/:id
app.get('/todos/:id', function(request, response) {
	var theID = parseInt(request.params.id, 10);
	var theTodo = todos.find((todo) => todo.id === theID);

	if (theTodo) {
		response.json(theTodo);
	} else {
		response.status(404).send();
	}
});

// DELETE - /todos/:id
app.delete('/todos/:id', function(request, response) {
	var theID = parseInt(request.params.id, 10);
	var todo = todos.find((todo) => todo.id === theID);
	var filteredTodos = todos.filter((todo) => todo.id !== theID);

	if (todo && filteredTodos) {
		todos = filteredTodos;
		response.json(todo);
	} else {
		response.status(404).send();
	}
});

app.put('/todos/:id', function(request, response) {
	var body = request.body;
	var updatedValues = {};
	var theID = parseInt(request.params.id, 10);
	var todo = todos.find((todo) => todo.id === theID);

	if (body.hasOwnProperty('completed') && typeof body.completed === 'boolean') {
		updatedValues.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return response.status(400).json({"error": "Invalid Data"});
	}

	if (body.hasOwnProperty('description') && typeof body.description.trim() === 'string' && body.description.trim().length > 0) {
		updatedValues.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		return response.status(400).json({"error": "Invalid Syntax"});
	}

	if (!todo) {
		return response.status(404).json({"error": `The todo with id: ${theID}`});
	}

	todo = Object.assign(todo, updatedValues);

	response.json(todo);

});

app.listen(PORT, function() {
	console.log(`listening on port: ${PORT}`);
});