// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Todo = new Schema({
	title: String,
	completed: {
		type: Boolean,
		default: false
	}
});


mongoose.model('Todo', Todo);