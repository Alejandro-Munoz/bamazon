const mysql = require("mysql2/promise");
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
			console.log(results);
		}, function(error) {
			if(error) {
				throw error
			}
		});
}

module.exports = displayAllItems;