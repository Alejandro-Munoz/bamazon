const mysql = require("mysql2/promise");
const table = require("cli-table");
const inquirer  = require("inquirer");
const connectionDetails = require("./connectionDetails");

/*
	Queries the products table and then will prompt the user whether they would like to make a purchase
*/
function displayAllItems() {
	const sqlQuery = "SELECT * FROM products ORDER BY item_id";

	mysql.createConnection(connectionDetails())
		.then((conn) => {
			// Execute query
			const results = conn.query(sqlQuery);

			conn.end();

			return results;
		})
		.then((results) => {
			displayData(results);

			promptUserToBuy(results);
		}).catch(function(error) {
			if(error) {
				console.log(error);
			}
		});
}

/*
	Loops through the product table rows and creates a table for display
*/
function displayData(results) {

	let dataTable = new table({
		head: ["Item Id", "Product Name", "Department Name", "Price", "Stock Qty"],
		colWidths: [10, 20, 20, 10, 15]
	});

	for(let i=0; i<results[0].length; i++) {
		const row = [results[0][i].item_id, 
			results[0][i].product_name, 
			results[0][i].department_name, 
			parseFloat(results[0][i].price).toFixed(2), 
			results[0][i].stock_quantity];

		dataTable.push(row);
	}

	console.log(dataTable.toString());
}

/*
	Prompts user to provide an item ID for purchase, then will prompt for the quantity.
*/
function promptUserToBuy(results) {
	inquirer
		.prompt([
			{
				type: "input",
				name: "itemID",
				message: "Please enter the ID of the item you would like to buy:",
				validate: function(input) {
					if(isNaN(input) || !doesItemIdExist(results, input)) {
						return "That item ID does not exist, please choose a valid ID.";
					} 

					return true;
				}
			},
			{
				type: "input",
				name: "itemQty",
				message: "How many of that item would you like to purchase?",
				validate: function(input) {
					if(isNaN(input)) {
						return "That is an invalid amount.  Please enter a valid number.";
					}

					return true;
				}
			}
		]).then((answers) => {
			if(!quantityAvailable(results, answers.itemID, answers.itemQty)) {
				console.log("The stored currently does not have enough stock to fulfill your order.");

				return;
			}

			processOrder(answers.itemID, answers.itemQty);
		});
}

/*
	Loops through the products table looking for the provided item ID
*/
function doesItemIdExist(results, itemID) {
	for(let i=0; i<results[0].length; i++) {
		if(results[0][i].item_id === parseInt(itemID)) {
			
			return true;
		}
	}

	return false;
}

/*
	Checks if enough stock is available for order
*/
function quantityAvailable(results, itemID, quantity) {
	console.log(itemID, quantity);

	for(let i=0; i<results[0].length; i++) {
		if(results[0][i].item_id === parseInt(itemID)) {
			if(parseInt(quantity) > results[0][i].stock_quantity) {
				return false;
			} else {
				return true;
			}
		}
	}

	return false;
}

function getItemDetails(itemID) {
	const sqlQuery = "SELECT * FROM products WHERE ?";

	return mysql.createConnection(connectionDetails())
		.then((conn) => {
			// Execute query
			const results = conn.query(sqlQuery, [{item_id: itemID}]);

			conn.end();

			return results;
		}).then((results) => {
			return results;
		}).catch((error) => {
			if(error) {
				console.log(error);
			}
		});
}



function processOrder(itemID, quantity) {
	// Print order
	let orderTable = new table({
		head: ["Item Id", "Product Name", "Price", "Qty", "Order Total"],
		colWidths: [10, 20, 10, 10, 10]
	});

	const itemDetails = getItemDetails(itemID);
	
	itemDetails.then((itemDetails) => {
		console.log(getItemDetails);
		/*
		const row = [itemDetails[0][0].item_id, itemDetails[0][0].product_name, getItemDetails[0][0].price, quantity, parseFloat(getItemDetails[0][0].price) * quantity];

		orderTable.push(row);

		console.log(orderTable.toString());

			// Update stock quantity
			updateQuantity(itemID, quantity);
		*/
	}).catch((error) => {
		if(error) {
			console.log(error);
		}
	});
}

function updateQuantity(itemID, quantity) {
	const sqlQuery = "UPDATE products SET stock_quantity = stock_quantity - " + parseInt(quantity) + " WHERE ?";

	mysql.createConnection(connectionDetails())
		.then((conn) => {
			// Execute query
			conn.query(sqlQuery, [{item_id: itemID}]);

			conn.end();
		}).catch(function(error) {
			if(error) {
				console.log(error);
			}
		});
}

module.exports = displayAllItems;