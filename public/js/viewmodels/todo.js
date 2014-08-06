/*global define, window */

define([
	'knockout',
	'config/global',
	'models/Todo'
], function(ko, g, Todo) {
	'use strict';
	var url = '/todo';
	// our main view model
	var ViewModel = function(todos) {
		var self = this,
			$collection;


		// map array of passed in todos to an observableArray of Todo objects
		// self.todos = ko.observableArray(ko.utils.arrayMap(todos, function (todo) {
		// 	return new Todo(todo.title, todo.completed);
		// }));

		self.current = ko.observable();
		self.isLoading = ko.observable(true);

		if (todos) {
			self.todos = ko.observableArray(ko.utils.arrayMap(todos, function(todo) {
				return new Todo(todo.title, todo.completed);
			}));
			self.isLoading(false);
		} else {
			self.todos = ko.observableArray();
			$collection = $.ajax({
				type: "GET",
				url: url + '/all',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			});
			$collection.done(function(data) {
				ko.utils.arrayMap(data, function(todo) {
					self.todos.push(new Todo(todo.title, todo.completed, todo._id));
				});
			});
		}


		// store the new todo value being entered


		// add a new todo, when enter key is pressed
		self.add = function() {
			var current = self.current().trim(),
				todo;

			if (current) {
				todo = new Todo(current);
				todo.save();
				self.todos.push(todo);
				self.current('');
			}
		};

		self.update = function(todo) {
			todo.update();
			return true;
		}

		// remove a single todo
		self.remove = function(todo) {
			self.todos.remove(todo);
			todo.delete();
		};

		// remove all completed todos
		self.removeCompleted = function() {
			self.todos.remove(function(todo) {
				return todo.completed();
			});
		};

		// edit an item
		self.editItem = function(item) {
			item.editing(true);
		};

		// stop editing an item.  Remove the item, if it is now empty
		self.stopEditing = function(item) {
			item.editing(false);

			var title = item.title();
			var trimmedTitle = title.trim();
			if (!trimmedTitle) {
				item.delete();
				self.remove(item);
				return true;
			}

			// Observable value changes are not triggered if they're consisting of whitespaces only
			// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
			// And if yes, we've to set the new value manually
			if (title !== trimmedTitle) {
				item.title(trimmedTitle);
			}
			item.update();

			
		};

		// count of all completed todos
		self.completedCount = ko.computed(function() {
			return ko.utils.arrayFilter(self.todos(), function(todo) {
				return todo.completed();
			}).length;
		});

		// count of todos that are not complete
		self.remainingCount = ko.computed(function() {
			return self.todos().length - self.completedCount();
		});

		// writeable computed observable to handle marking all complete/incomplete
		self.allCompleted = ko.computed({
			//always return true/false based on the done flag of all todos
			read: function() {
				return !self.remainingCount();
			},
			// set all todos to the written value (true/false)
			write: function(newValue) {
				ko.utils.arrayForEach(self.todos(), function(todo) {
					// set even if value is the same, as subscribers are not notified in that case
					if (todo.completed() !== newValue) {
						todo.completed(newValue);
						todo.update();
					}

				});
			}
		});

		// helper function to keep expressions out of markup
		self.getLabel = function(count) {
			return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
		};

		// internal computed observable that fires whenever anything changes in our todos
		/*ko.computed(function () {
			// store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
			window.localStorage.setItem(g.localStorageItem, ko.toJSON(self.todos));
		}).extend({
			rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
		});*/ // save at most twice per second
	};

	return ViewModel;
});