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
					break;
				case "Add to Inventory":
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
				}).catch(function(error) {
					if(error) {
						console.error(error);
					}
				});
		} // End displayAllProducts

		function displayLowInventory() {
			const sqlQuery = "SELECT * FROM products " +
										" WHERE stock_quantity < 5";

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const results = conn.query(sqlQuery);

					conn.end();

					return results;
				})
				.then((results) => {
					displayData(results);
				}).catch(function(error) {
					if(error) {
						console.error(error);
					}
				});
			} // End displayLowInventory
		

}

module.exports = bamazonManager;