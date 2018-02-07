const mysql = require("mysql2/promise");
const connectionDetails = require("./connectionDetails");


exports.getAllProducts = function() {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = "SELECT * FROM products ORDER BY item_id";

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const results = conn.query(sqlQuery);

					conn.end();

					resolve(results);
				}).catch(function(error) {
					if(error) {
						reject(error);
					}
				});
			}
	);
}