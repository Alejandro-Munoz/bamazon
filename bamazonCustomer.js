const table = require("cli-table");
const inquirer  = require("inquirer");
const databaseQueries = require("./databaseQueries");
const bamazonUtils = require("./bamazonUtils");

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
	databaseQueries.getAllProducts()
		.then((results) => {
			console.log("\n---- Current List of Items on Sale ----");

			const colNames = ["Item Id", "Product Name", "Department Name", "Price"];
			const colWidths = [10, 20, 20, 10];
			
			bamazonUtils.displayData(results, colNames, colWidths);

			promptUserToBuy(results);
		}).catch((error) => {
			if(error) {
				console.error(error);
			}
		});

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
					enoughQuantityAvailable(answers.itemID, answers.itemQty);
				});
		} // End promptUserToBuy

		/*
			Checks if enough stock is available for order
		*/
		function enoughQuantityAvailable(itemID, quantityWanted) {
			databaseQueries.enoughQuantityAvailable(itemID, quantityWanted)
				.then((results) => {
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
		} // End enoughQuantityAvailable

		/*
			Will print the order to the terminal
		*/
		function finalizeOrder(itemID, quantityPurchased) {
			databaseQueries.getData(itemID)
				.then((results) => {
					printOrder(results, itemID, quantityPurchased);

					return true;
				}).then((results) => { 
					if(results) {
						// Now update the product sales
						databaseQueries.updateProductSales(itemID, quantityPurchased)
							.then(() => {

							}).catch((error) => {
								if(error) {
									console.log(error);
								}
							});
					}
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
			databaseQueries.updateStockQuantity(itemID, quantityPurchased)
				.then((results) => {
					if(results[0].affectedRows >= 1) {
						finalizeOrder(itemID, quantityPurchased);
					} else {
						throw("Error encountered while attempting to update stock quantity.  The order in progress has been cancelled.");
					}
				}).catch((error) => {
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