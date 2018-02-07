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

exports.getLowInventory = function(threshold) {
	return new Promise(
			function(resolve, reject) {
				const sqlQuery = "SELECT * FROM products " +
											" WHERE stock_quantity < ?";

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [threshold]);

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

exports.getData = function(itemId) {
	return new Promise(
			function(resolve, reject) {
				const sqlQuery = "SELECT * FROM products " +
											" WHERE item_id = ?";

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [itemId]);

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

exports.addToInventory = function(itemId, amount) {
	return new Promise(
			function(resolve, reject) {
				const sqlQuery = "UPDATE products SET stock_quantity = stock_quantity + ?" +
							" WHERE item_id = ?";

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [amount, itemId]);

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