const table = require("cli-table");

exports.displayData = function(results) {
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

exports.validateItemIdInput = function(input, resultsTable) {
	if(isNaN(input) || !doesItemIdExist(resultsTable, input)) {
		return "That item ID does not exist, please choose a valid ID.";
	} 

	return true;
}