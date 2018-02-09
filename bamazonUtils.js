const table = require("cli-table");

/*
exports.displayData = function(results) {
	let dataTable = new table({
		head: ["Item Id", "Product Name", "Department Name", "Price"],
		colWidths: [10, 20, 20, 10]
	});

	for(let i=0; i<results[0].length; i++) {
		const row = [results[0][i].item_id, 
			results[0][i].product_name, 
			results[0][i].department_name, 
			parseFloat(results[0][i].price).toFixed(2)];

		dataTable.push(row);
	}

	console.log(dataTable.toString());
}
*/

exports.validateItemIdInput = function(input, resultsTable) {
	if(isNaN(input) || !doesItemIdExist(resultsTable, input)) {
		return "That item ID does not exist, please choose a valid ID.";
	} 

	return true;
}

exports.displayData = function(results, displayColNames, colWidths) {
	let dataTable = new table({
		head: displayColNames,
		colWidths: colWidths
	}); 

	for(let i=0; i<results[0].length; i++) {
		const row = [];

		for(let j=0; j<results[1].length; j++) {
			row.push(results[0][i][results[1][j].name]);
		}

		dataTable.push(row);
	}

	console.log(dataTable.toString());
}