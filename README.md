# E-commerce API (Ainda em desenvolvimento)

This project is a RESTful API for an e-commerce platform, built with Node.js, Express, and MongoDB (using Mongoose). It manages users, products, and orders, allowing clients to create and track orders with detailed product information.

## Features

- User management with authentication
- Product catalog management
- Order creation and tracking
- Data relationships with Mongoose population (e.g., orders populate product details)
- Order status tracking (processing, paid, shipped, delivered)

## Technologies

- Node.js
- Express
- MongoDB with Mongoose
- JavaScript (ES6+)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder
   npm install
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   PORT=5000
   npm start
   ```


## Usage

* Use API clients like Postman or curl to interact with the endpoints.
* Endpoints include user registration/login, product listing, order creation, and order status updates.
* Orders include detailed product information via Mongoose population.

## Project Structure

* `src/models/` - Mongoose schemas for User, Product, Order
* `src/routes/` - Express route handlers
* `src/controllers/` - Business logic for each route
* `src/app.js` - Express app setup
* `server.js` - Server entry point

## Notes

* Make sure MongoDB is running locally or provide a remote connection string.
* The `Order` model uses population to link order items to products.
* Order statuses are: `processando` (processing), `pago` (paid), `enviado` (shipped), `entregue` (delivered).

## License

This project is open source and available under the MIT License.
