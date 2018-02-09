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
				choices: ["View Product Sales by Department", "Create New Department"]
			}

		]).then((answers) => {
			switch(answers.userAction) {
				case "View Product Sales by Department":
					productSalesByDepartment();
					break;
				case "Create New Department":
					console.log("coming soon");
					break;
				default:
					console.error("Encountered unhandled selection: " + answers.userAction);
			}
		});

		function productSalesByDepartment() {
			databaseQueries.productSalesByDepartment()
				.then((results) => {
					const displayColNames = ["Dept Id", "Dept Name", "Over Head Costs", "Product Sales", "Total Profit"];

					const colWidths = [10, 20, 20, 15, 15];

					bamazonUtils.displayDataV2(results, displayColNames, colWidths);
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
		}
}

module.exports = bamazonManager;