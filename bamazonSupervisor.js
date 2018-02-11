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
					newDepartment();
					break;
				default:
					console.error("Encountered unhandled selection: " + answers.userAction);
			}
		});

		function productSalesByDepartment() {
			databaseQueries.productSalesByDepartment()
				.then((results) => {
					if(results[0].length <= 0) {
						console.log("There are currently 0 items for sale in the store.");
					} else {
						const displayColNames = ["Dept Id", "Dept Name", "Over Head Costs", "Product Sales", "Total Profit"];
						const colWidths = [10, 20, 20, 15, 15];

						bamazonUtils.displayData(results, displayColNames, colWidths);
					}
				}).catch((error) => {
					if(error) {
						console.error(error);
					}
				});
		}

		function newDepartment() {
			inquirer
				.prompt([
					{
						type: "input",
						name: "deptName",
						message: "Depatment name?"
					},
					{
						type: "input",
						name: "overHead",
						message: "Depatment over head costs?",
						validate: function(input) {
							if(isNaN(input) || input < 0) {
								return "Please provide a valid over head cost value";
							}

							return true;
						}
					}
				]).then((answers) => {
						databaseQueries.createDepartment(answers.deptName, answers.overHead)
							.then((results) => {
								console.log("Deparment successfully added.");
							}).catch((error) => {
								if(error) {
									console.error(error);
								}
							});
				});
		}
}

module.exports = bamazonManager;