const inquirer = require("inquirer");
const bamazonCustomer = require("./bamazonCustomer");
const bamazonManager = require("./bamazonManager");
const bamazonSupervisor = require("./bamazonSupervisor");

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
				bamazonSupervisor();
				break;
			default:
				console.error("Encountered unhandled selection: " + answers.viewSelection);
		}
	});