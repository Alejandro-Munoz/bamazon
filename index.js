const inquirer = require("inquirer");
const bamazonCustomer = require("./bamazonCustomer");
const bamazonManager = require("./bamazonManager");

inquirer
	.prompt([
		{
			type: "list",
			name: "viewSelection",
			message: "Select a view",
			choices: ["Customer", "Manager", "Supervisor"]
		}
	]).then((answers) => {
		switch(answers.viewSelection) {
			case "Customer":
				bamazonCustomer();
				break;
			case "Manager":
				bamazonManager();
				break;
			case "Supervisor":
				console.log("Coming Soon");
				break;
			default:
				console.error("Encountered unhandled selection: " + answers.viewSelection);
		}
	});