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
				choices: ["View Product Sales by Department", "Create New Department"]
			}

		]).then((answers) => {
			console.log(answers.userAction);
		});
}

module.exports = bamazonManager;