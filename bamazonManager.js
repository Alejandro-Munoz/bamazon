const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const table = require("cli-table");
const connectionDetails = require("./connectionDetails");

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
				}).catch(function(error) {
					if(error) {
						console.error(error);
					}
				});
		} // End displayAllProducts

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