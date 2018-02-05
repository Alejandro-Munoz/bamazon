const mysql = require("mysql2/promise");
const table = require("cli-table");
const inquirer  = require("inquirer";)
const connectionDetails = require("./connectionDetails");

function displayAllItems() {
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
		}, function(error) {
			if(error) {
				throw error
			}
		});
}

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
}

function promptUserToBuy() {

}

module.exports = displayAllItems;