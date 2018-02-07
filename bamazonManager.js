const inquirer = require("inquirer");

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
			console.log(answers.userAction);
		});
}

module.exports = bamazonManager;