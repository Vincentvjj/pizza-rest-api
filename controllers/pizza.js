// this is the controller for the pizza related functions

var db = require('../models/db');

/**
* GET /v1/pizza
*/

exports.getAllPizza = function(req, res) {
	db.getAllPizza().then(function(data) {
		var idArray = [];
		for(var id in data) {
			idArray.push(parseInt(id));
		}
		if(idArray.length === 0) {
			return res.status(404).send({message: "No Pizzas Exist"});
		} else {
			console.log("GET ALL: " + JSON.stringify(data));
			return res.send(idArray);
		}
	});
};

/**
* GET /v1/pizza/:pizzaId
*/
exports.getPizzaById = function(req, res) {
	var id = parseInt(req.params.pizzaId); 
	// checks if ID passed is a good ID
	if(isNaN(id)) {
		return res.status(400).send({message: "Invalid ID supplied"});
	}

	db.getPizzaById(id).then(function(data) {
		console.log("GET BY ID: " + JSON.stringify(data));
		var returnObj = {
			id: data.id,
			name: data.name,
			size: data.size,
			price: data.price
		}
		return res.send(returnObj);
	}).catch(function(err) {
		return res.status(404).send({message: "Pizza could not be found"});
	});
};

/**
* PUT /v1/pizza/:pizzaId
*/
exports.updatePizza = function(req, res) {
	var id = req.params.pizzaId;
	// checks if ID passed is a good ID
	if(isNaN(id)) {
		return res.status(400).send({message : "Invalid ID supplied"});
	}
	var name = req.body.name;
	var size = req.body.size;
  	var price = exports.checkPrice(size);
  	if(price === -1 || (name != undefined && typeof name !== "string") || (size != undefined && typeof size !== "string")) {
		return res.status(400).send({message : "Invalid Pizza supplied"});
  	}

	db.updatePizza(id, name, size, price).then(function(){
		console.log("UPDATED PIZZA ID: " + id);
		return res.status(204).send({message : "updated pizza id: " + id});
	}).catch(function(err) {
		console.log(err);
		return res.status(404).send({message : err});
	});
};

/**
* DELETE /v1/pizza/:pizzaId
*/
exports.deletePizza = function(req, res) {
	var id = parseInt(req.params.pizzaId); 
	// checks if ID passed is a good ID
	if(isNaN(id)) {
		return res.status(400).send({message : "Invalid ID supplied"});
	}

	db.deletePizza(id).then(function(){
		console.log("DELETED PIZZA ID: " + id);
		return res.status(204).send({message : "deleted pizza id: " + id});
	}).catch(function(err) {
		console.log(err);
		return res.status(404).send({message: err});
	});
};

/**
* POST /v1/pizza
*/
exports.postPizza = function(req, res, next) {
	var name = req.body.name;
	var size = req.body.size;
	var price = exports.checkPrice(size);

	if(price === -1 || price == undefined || name == undefined || typeof name !== "string") {
		return res.status(400).send({message : "Invalid Pizza"});
	}

	db.insertPizza(name, size, price).then(function(data) {
		var location = req.protocol + "://" + req.get('host') + req.originalUrl + data;
		console.log("CREATED PIZZA: " + location);
		res.setHeader('location', location);
		return res.status(201).json({message: "Created new pizza"});
	});

};


////////// Helper methods //////////////////
exports.checkPrice = function(size) {
	if (size == undefined || typeof size !== "string") {
		return undefined;
	} else if(size.toLowerCase() === "standard") {
		return 5.00;
	} else if(size.toLowerCase() === "large") {
		return 8.50;
	} else {
		return -1;
	}
};