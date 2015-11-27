var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Do laundry',
	completed: false
}, {
	id: 2,
	description: 'Clean room',
	completed: false
}, {
	id: 3,
	description: 'Vacuum carpet',
	completed: true
}];

app.get('/', function(request, response) {
	response.send('Todo: API root');
});

// GET - /todos
app.get('/todos', function(request, response) {
	response.json(todos);
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