const inquirer = require("inquirer");
const databaseQueries = require("./databaseQueries");
const bamazonUtils = require("./bamazonUtils");

function bamazonManager() {
	promptUser();
}

function promptUser() {
	inquirer
		.prompt([
		{
			type: "list",
			name: "userAction",
			message: "Please select from the following options",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
		]).then((answers) => {
			switch(answers.userAction) {
				case "View Products for Sale":
					displayAllProducts();
					break;
				case "View Low Inventory":
					displayLowInventory();
					break;
				case "Add to Inventory":
					addInventory()
					break;
				case "Add New Product":
					break;
				default:
					console.error("Encountered unhandled selection: " + answers.userAction);
			}
		});

		function displayAllProducts() {
			databaseQueries.getAllProducts()
				.then((results) => {
					bamazonUtils.displayData(results);
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
		} // End displayAllProducts

		function displayLowInventory() {
			databaseQueries.getLowInventory(5)
				.then((results) => {
					bamazonUtils.displayData(results);
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
			} // End displayLowInventory
		
		function addInventory() {
			inquirer
				.prompt([
				{
					type: "input",
					name: "itemID",
					message: "Please enter the ID of the item you would like to add inventory to?",
					validate: function(input) {
						if(isNaN(input) || input <= 0) {
							return "That is an invalid item ID.  Please enter a valid ID value.";
						}
						
						return true;
					}
				},
				{
					type: "input",
					name: "amount",
					message: "How much quantity should be added?",
					validate: function(input) {
						if(isNaN(input) || input <= 0) {
							return "That is an amount.  Please enter a value > 0,";
						}
						
						return true;
					}	
				}
				]).then((answers) => {
					databaseQueries.getData(answers.itemID)
						.then((results) => {
							if(results[0].length == 0) {
								console.log("No data found for ID: " + answers.itemID);
							} else {
								databaseQueries.addToInventory(answers.itemID, answers.amount)
									.then((results) => {
										console.log("Inventory successfully added.");
									}).catch((error) => {
										if(error) {
											console.error(error);
										}
									});
							}
						}).catch((error) => {
							if(error) {
								console.error(error);
							}
						});
				});
		}
}

module.exports = bamazonManager;