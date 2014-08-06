/*global define */

define([
	'knockout',
	'jquery'
], function(ko, $) {
	'use strict';

	var url = '/todo';
	// represent a single todo item
	var Todo = function(title, completed, id) {
		this._id = id || null;
		this.title = ko.observable(title);
		this.completed = ko.observable(completed);
		this.editing = ko.observable(false);
	};

	Todo.prototype.update = function() {
		return $.ajax({
			type: "PUT",
			url: url,
			data: ko.toJSON(this),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json'
		});
	};
	
	Todo.prototype.save = function() {
		return $.ajax({
			type: "POST",
			url: url,
			data: ko.toJSON(this),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json'
		});
	};

	Todo.prototype.delete = function() {
		return $.ajax({
			type: "DELETE",
			url: url,
			data: ko.toJSON(this),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json'
		});
	};

	return Todo;
});