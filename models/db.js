var pizza = require('../controllers/pizza');

// database model 
var db = {
	pizzas: {

	},
	orders: {

	}
}

var latestPizzaId;

////////// PIZZA STUFF ////////////
exports.getAllPizza = function() {
	return new Promise(function(resolve, reject) {
		resolve(db.pizzas);
	});
};

exports.getPizzaById = function(id) {
	return new Promise(function(resolve, reject) {
		if(db.pizzas[id]) {
			resolve(db.pizzas[id]);
		} else {
			reject("Pizza could not be found");
		}
	});
};

exports.updatePizza = function(id, name, size, price) {
	return new Promise(function(resolve, reject) {
		exports.getPizzaById(id).then(function(data){
			var newPrice = data.price - pizza.checkPrice(data.size) + price;
			db.pizzas[id].name = name;
			db.pizzas[id].size = size;
			db.pizzas[id].price = newPrice;
			resolve();
		}).catch(function(err) {
			reject(err);
		});
	});
};

exports.deletePizza = function(id) {
	return new Promise(function(resolve, reject) {
		exports.getPizzaById(id).then(function(data){
			delete db.pizzas[id];
			resolve();
		}).catch(function(err) {
			reject(err);
		});
	});
};


exports.insertPizza = function(name, size, price) {
	return new Promise(function(resolve, reject) {
		var createId = latestPizzaId == null ? 0 : latestPizzaId + 1;

		db.pizzas[createId] = {
			id: createId,
			name: name,
			size: size,
			price: price
		};
		latestPizzaId = createId;
		resolve(latestPizzaId);
	});
};

////////// TOPPING STUFF ////////////
var latestToppingId;

exports.insertTopping = function(pizzaId, name, price) {
	return new Promise(function(resolve, reject) {
		var createId = latestToppingId == null ? 0 : latestToppingId + 1;
		exports.getPizzaById(pizzaId).then(function(data){
			//if this is the first topping added
			if(db.pizzas[pizzaId].toppings == null) {
				db.pizzas[pizzaId].toppings = {};
			} 
			db.pizzas[pizzaId].toppings[createId] = {
				id: createId,
				name: name,
				price: price
			}
			// add the price to the total price
			db.pizzas[pizzaId].price += price;
			latestToppingId = createId;
			resolve(latestToppingId);
		}).catch(function(err) {
			reject(err);
		});
	});
};

exports.getAllTopping = function(pizzaId) {
	return new Promise(function(resolve, reject) {
		exports.getPizzaById(pizzaId).then(function(data){
			resolve(db.pizzas[pizzaId].toppings);
		}).catch(function(err) {
			reject(err);
		});		
	});
};

exports.getToppingById = function(pizzaId, toppingId) {
	return new Promise(function(resolve, reject) {
		exports.getPizzaById(pizzaId).then(function(data){
			if(db.pizzas[pizzaId].toppings && db.pizzas[pizzaId].toppings[toppingId]) {
				resolve(db.pizzas[pizzaId].toppings[toppingId]);
			} else {
				reject("Specified topping id not found");

			}
		}).catch(function(err) {
			reject(err);
		});
	});
};


exports.deleteTopping = function(pizzaId, toppingId) {
	return new Promise(function(resolve, reject) {
		exports.getToppingById(pizzaId, toppingId).then(function (data) {
			delete db.pizzas[pizzaId].toppings[toppingId];
			db.pizzas[pizzaId].price -= data.price;
			resolve();
		}).catch(function(err) {
			reject(err);
		});
	});
};

////////// ORDER STUFF ////////////
var latestOrderId;

exports.postOrder = function(orderItems, recipient, totalPrice) {
	return new Promise(function(resolve, reject) {
		var createId = latestOrderId == null ? 0 : latestOrderId + 1;
		db.orders[createId] = {
			id: createId,
			orderItems: orderItems,
			totalPrice: totalPrice,
			recipient: recipient
		};
		latestOrderId = createId;
		resolve(latestOrderId);
	});
};

exports.getAllOrder = function() {
	return new Promise(function(resolve, reject) {
		resolve(db.orders);	
	});
}

