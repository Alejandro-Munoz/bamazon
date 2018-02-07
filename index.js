const inquirer = require("inquirer");
const bamazonCustomer = require("./bamazonCustomer");
const bamazonManager = require("./bamazonManager");

inquirer
	.prompt([
		{
			type: "list",
			name: "viewSelection",
			message: "Select from the following choices",
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
				console.log("Unhandled selection encountered");
		}
	});