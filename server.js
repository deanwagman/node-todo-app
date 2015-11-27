var express = require('express');
var bodyParser = require('body-parser');
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
	response.json(todos);
});

// POST
app.post('/todos', function(request, response) {
	var body = request.body;
	body.id = todoNextId++;

	todos.push(body);

	response.json(body);
});

// GET - /todos/:id
app.get('/todos/:id', function(request, response) {
	var theID = parseInt(request.params.id, 10);
	var theTodo = todos.find(function(todo) {
		return todo.id === theID;
	});

	if (theTodo) {
		response.json(theTodo);
	} else {
		response.status(404).send();
	}
});

app.listen(PORT, function() {
	console.log(`listening on port: ${PORT}`);
});