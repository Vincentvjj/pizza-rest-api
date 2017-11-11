var db = require('../models/db');

/**
* POST /v1/order
*/
exports.postOrder = function(req, res) {
	var orderItems = req.body.orderItems;
	var recipient = req.body.recipient;
	var totalPrice = 0;	

	// if it is not inline with the parameter model, which requires it to be in an array
	if(!Array.isArray(orderItems) || !recipient || typeof recipient !== "string") {
		return res.status(400).send({message: "invalid order"});
	}

	var promises = [];
	var reqOrderItems = [];
	for(var i = 0; i < orderItems.length; i++) {
		var pizzaId = parseInt(orderItems[i].pizzaId);
		var quantity = parseInt(orderItems[i].quantity);

		// first check if there are these properties, and then if these properties are good values.
		if(isNaN(pizzaId) || isNaN(quantity)) {
			return res.status(400).send({message: "invalid order"});
		} else {	
			// use the Parse Int'ed values
			reqOrderItems.push({
				pizzaId: pizzaId,
				quantity: quantity
			});
			// put them in a promise array
			promises.push(db.getPizzaById(pizzaId));
		}
	}
	// search all pizzaIds from orderItems, and check if these pizzas exist.
	Promise.all(promises).then(function(data) {
		// if they all exist, continue with the order
		for(var i = 0; i < data.length; i++) {
			totalPrice += data[i].price * reqOrderItems[i].quantity;
		}
		db.postOrder(reqOrderItems, recipient, totalPrice).then(function(data) {
			var location = req.protocol + "://" + req.get('host') + req.originalUrl + "/" + data;
			console.log("CREATED ORDER ID: " + data);
			res.setHeader('location', location);
			res.status(201).send("Created new order successfully");
		});
	}).catch(function(err) {
		return res.status(400).send({message: err}); // cannot find the pizzaId
	});
};

exports.getAllOrder = function(req, res) {
	db.getAllOrder().then(function(data) {
		var idArray = [];
		for(var id in data) {
			idArray.push(parseInt(id));
		}
		if(idArray.length === 0) {
			return res.status(404).send({message: "No orders found"});
		} else {
			console.log("GET ALL ORDER: " + JSON.stringify(data));
			return res.send(idArray);
		}
	});
};