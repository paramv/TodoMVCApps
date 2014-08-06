var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Todo = mongoose.model('Todo');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/todo/all', function(req, res, next) {

    Todo.find(function(err, todos) {
        if (err) return next(err);
        res.json(todos);
    });
});

router.post('/todo', function(req, res, next) {
    var todo = new Todo(req.body);
    console.log(req.body, req.body.title);
    todo.save(function(err) {
        if (err) return next(err);
        res.status(200);
        res.send('OK');
    });
});

router.put('/todo', function(req, res, next) {
    var body = req.body;
    Todo.findOne({
        _id: req.body._id
    }, function(err, doc) {
        if (err) return next(err);
        if (!doc) return next(new Error('Document is null'));
        doc.title = body.title;
        doc.completed = body.completed;
        doc.save(function(err) {
            if (err) return next(err);
            res.status(200);
            res.send('OK');
        });
    })
});

router.delete('/todo', function(req, res, next) {
    var body = req.body;
    Todo.findOne({
        _id: req.body._id
    }, function(err, doc) {
        if (err) return next(err);
        doc.remove(function(err) {
            if (err) return next(err);
            res.status(200);
            res.send('OK');
        });
    })
});