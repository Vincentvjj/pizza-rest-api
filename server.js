var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// Controllers
var pizzaController = require('./controllers/pizza');
var toppingController = require('./controllers/topping');
var orderController = require('./controllers/order');

var app = express();

app.set('port', process.env.PORT || 8000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// Routings Pizza
app.get('/v1/pizza', pizzaController.getAllPizza);
app.get('/v1/pizza/:pizzaId', pizzaController.getPizzaById);
app.put('/v1/pizza/:pizzaId', pizzaController.updatePizza);
app.delete('/v1/pizza/:pizzaId', pizzaController.deletePizza);
app.post('/v1/pizza', pizzaController.postPizza);

// Routings Toppings
app.post('/v1/pizza/:pizzaId/topping', toppingController.postTopping);
app.get('/v1/pizza/:pizzaId/topping', toppingController.getAllTopping);
app.get('/v1/pizza/:pizzaId/topping/:toppingId', toppingController.getToppingById);
app.delete('/v1/pizza/:pizzaId/topping/:toppingId', toppingController.deleteTopping);

// Routings Orders
app.post('/v1/order', orderController.postOrder);
app.get('/v1/order', orderController.getAllOrder);
app.get('/v1/order/:orderId', orderController.getOrderById);
app.delete('/v1/order/:orderId', orderController.deleteOrder);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
