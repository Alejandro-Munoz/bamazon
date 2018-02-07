const mysql = require("mysql2/promise");
const table = require("cli-table");
const inquirer  = require("inquirer");
const connectionDetails = require("./connectionDetails");

/*
	Starting point
*/
function bamazonCustomer() {
	displayAllItems();
}

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
				console.error(error);
			}
		});

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
		} // End displayData

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
							if(isNaN(input) || input <= 0) {
								return "That is an invalid amount.  Please enter a valid quantity value.";
							}

							return true;
						}
					}
				]).then((answers) => {
					quantityAvailable(answers.itemID, answers.itemQty);
				});
		} // End promptUserToBuy

		/*
			Checks if enough stock is available for order
		*/
		function quantityAvailable(itemID, quantityWanted) {
			const sqlQuery = "SELECT " +
								" (CASE " +
								" WHEN stock_quantity >= ? THEN 1 " +
								" ELSE 0 " +
			 					" END) available_stock " +
								" FROM products " +
								" WHERE item_id = ?";

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					const results = conn.query(sqlQuery, [quantityWanted, itemID]);

					conn.end();

					return results;
				}).then((results) => {
					if(results[0][0].available_stock == 0) {
						console.log("The store currently does not have enough stock to fulfill your order for item ID " + itemID);
					} else if(results[0][0].available_stock == 1) {
						processOrder(itemID, quantityWanted);
					} else {
						throw ("Invalid result encountered during inventory check");
					}
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
		} // End quantityAvailable

		/*
			Will print the order to the terminal
		*/
		function finalizeOrder(itemID, quantityPurchased) {
			const sqlQuery = "SELECT * FROM products WHERE ?";

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const results = conn.query(sqlQuery, [{item_id: itemID}]);

					conn.end();

					return results;
				}).then((results) => {
					printOrder(results, itemID, quantityPurchased);
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
		} // End finalizeOrder

		/*
			Executes logic to process an order which involves updating stock in the database and then
			printing the order details
		*/
		function processOrder(itemID, quantityPurchased) {
			// 1. Update stock quantity
			// 2. The finalizeOrder function will be called once the stock quantity has been successfully updated.
			updateStockQuantity(itemID, quantityPurchased);
		} // End processOrder

		/*
			Prints the order details to the terminal
		*/
		function printOrder(itemDetails, itemID, quantityPurchased) {
			// Print order
			let orderTable = new table({
				head: ["Item Id", "Product Name", "Price", "Qty", "Order Total"],
				colWidths: [10, 20, 10, 10, 15]
			});

			const row = [itemID, 
					itemDetails[0][0].product_name, 
					itemDetails[0][0].price, 
					quantityPurchased, 
					(parseFloat(itemDetails[0][0].price) * quantityPurchased).toFixed(2)
				]

			orderTable.push(row);

			console.log(orderTable.toString());
		} // End printOrder

		/*
			Updates the stock quantity in the database
		*/
		function updateStockQuantity(itemID, quantityPurchased) {
			const sqlQuery = "UPDATE products SET stock_quantity = stock_quantity - " + parseInt(quantityPurchased) + " WHERE ?";

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const result = conn.query(sqlQuery, [{item_id: itemID}]);

					conn.end();

					return result;
				}).then((results) => {
					if(results[0].affectedRows >= 1) {
						finalizeOrder(itemID, quantityPurchased);
					} else {
						throw("Error encountered while attempting to update stock quantity.  The order in progress has been cancelled.");
					}
				}).catch(function(error) {
					if(error) {
						console.error(error);
					}
				});
		} // End updateStockQuantity

} // End displayAllItems

/*
	Loops through the current results table looking for the provided item ID
*/
function doesItemIdExist(results, itemID) {
	for(let i=0; i<results[0].length; i++) {
		if(results[0][i].item_id === parseInt(itemID)) {
			
			return true;
		}
	}

	return false;
}

module.exports = bamazonCustomer;