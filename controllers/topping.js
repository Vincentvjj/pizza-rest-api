var db = require('../models/db');

/**
* POST /v1/pizza/:pizzaId/topping
*/
exports.postTopping = function(req, res) {
	var name = req.body.name;
	var price = parseFloat(req.body.price);
	var pizzaId = parseInt(req.params.pizzaId);

	if(isNaN(pizzaId) || isNaN(price)) {
		return res.status(400).send({message : "Invalid input"});
	}

	db.insertTopping(pizzaId, name, price).then(function(data) {
		var location = req.protocol + "://" + req.get('host') + req.originalUrl + "/" + data;
		console.log("CREATED TOPPING ID: " + location);
		res.setHeader('location', location);
		return res.status(201).json({message: "Created new topping for pizza"});
	}).catch(function(err) {
		return res.status(404).send({message: err});
	});
};

/**
* GET /v1/pizza/:pizzaId/topping
*/

exports.getAllTopping = function(req, res) {
	var pizzaId = parseInt(req.params.pizzaId);
	var idArray = [];
	if(isNaN(pizzaId)) {
		return res.status(400).send({message : "Invalid Input"});
	}

	db.getAllTopping(pizzaId).then(function(data) {
		for(var toppingId in data) {
			idArray.push(parseInt(toppingId));
		}
		if(idArray.length === 0) {
			console.log("NO TOPPINGS IN PIZZA ID: " + pizzaId);
			return res.status(400).send({message: "No toppings Exist"});
		} else {
			console.log("GET ALL TOPPING IN PIZZA " + pizzaId + ": " + JSON.stringify(data));
			return res.send(idArray);
		}	

	}).catch(function(err) {
		console.log(err);
		return res.status(404).send({message: err});
	});
};

/**
* GET /v1/pizza/:pizzaId/topping/:toppingId
*/
exports.getToppingById = function(req, res) {
	var pizzaId = parseInt(req.params.pizzaId);
	var toppingId = parseInt(req.params.toppingId);

	// checks if ID passed is a good ID
	if(isNaN(pizzaId) || isNaN(toppingId)) {
		return res.status(400).send({message: "Invalid ID(s) supplied"});
	}

	db.getToppingById(pizzaId, toppingId).then(function(data) {
		console.log("GET TOPPING BY ID: " + JSON.stringify(data));
		return res.send(data);
	}).catch(function(err) {
		console.log(err);
		return res.status(404).send({message: err});
	});
};

/**
* DELETE /v1/pizza/:pizzaId/topping/:toppingId
*/
exports.deleteTopping = function(req, res) {
	var pizzaId = parseInt(req.params.pizzaId);
	var toppingId = parseInt(req.params.toppingId);

	// checks if ID passed is a good ID
	if(isNaN(pizzaId) || isNaN(toppingId)) {
		return res.status(400).send({message: "Invalid ID(s) supplied"});
	}

	db.deleteTopping(pizzaId, toppingId).then(function() {
		console.log("DELETED TOPPING ID: " + toppingId);
		return res.status(204).send({message : "deleted topping id: " + toppingId + " from pizza " + pizzaId});
	}).catch(function(err) {
		return res.status(404).send({message: err});
	});
};