const mysql = require("mysql2/promise");
const connectionDetails = require("./connectionDetails");


exports.getAllProducts = function() {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `SELECT item_id, product_name, department_name, price 
													FROM products ORDER BY item_id`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const results = conn.query(sqlQuery);

					conn.end();

					resolve(results);
				}).catch((error) => {
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
				const sqlQuery = `SELECT * FROM products
														WHERE stock_quantity < ?`;

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [threshold]);

						conn.end();

						resolve(results);
					}).catch((error) =>{
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
				const sqlQuery = `SELECT * FROM products
														WHERE item_id = ?`;

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [itemId]);

						conn.end();

						resolve(results);
					}).catch((error) => {
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
				const sqlQuery = `UPDATE products 
														SET stock_quantity = stock_quantity + ?
														WHERE item_id = ?`;

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [amount, itemId]);

						conn.end();

						resolve(results);
					}).catch((error) => {
						if(error) {
							reject(error);
						}
					});
			}
	);
}

exports.addNewItem = function(productName, deptName, price, stockQty) {
	return new Promise(
			function(resolve, reject) {
				const sqlQuery = `INSERT INTO products(product_name, department_name, price, stock_quantity)
														VALUES(?,?,?,?)`;

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [productName, deptName, price, stockQty]);

						conn.end();

						resolve(results);
					}).catch((error) => {
						if(error) {
							reject(error);
						}
					});
			}
	);
}

exports.updateProductSales = function(itemId, quantityPurchased){
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `UPDATE products 
													SET product_sales = product_sales + (price * ?)
													WHERE item_id = ?`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					const results = conn.query(sqlQuery, [quantityPurchased, itemId]);

					conn.end();

					resolve(results);
				}).catch((error) => {
					if(error) {
						reject(error);
					}
				});
		}
	);
}

exports.enoughQuantityAvailable = function(itemId, quantityWanted) {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `SELECT 
													(CASE
														WHEN stock_quantity >= ? THEN 1
														ELSE 0
			 										END) available_stock
												FROM products
												WHERE item_id = ?`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					const results = conn.query(sqlQuery, [quantityWanted, itemId]);

					conn.end();

					resolve(results);
			}).catch((error) => {
				if(error) {
					reject(error);
				}
			});
		}
	);
}

exports.updateStockQuantity = function(itemID, quantityPurchased) {
	return new Promise(
		function(resolve, reject) {
			//const sqlQuery = "UPDATE products SET stock_quantity = stock_quantity - " + parseInt(quantityPurchased) + " WHERE ?";
			const sqlQuery = `UPDATE products 
													SET stock_quantity = stock_quantity - ?
													WHERE item_id = ?`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					// Execute query
					const result = conn.query(sqlQuery, [quantityPurchased, itemID]);

					conn.end();

					resolve(result);
			}).catch((error) => {
				if(error) {
					reject(error);
				}
			});
		}
	)
}

exports.productSalesByDepartment = function() {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `SELECT d.department_id,
														d.department_name,
														d.over_head_costs,
														sum(p.product_sales) product_sales,
														(sum(p.product_sales) - d.over_head_costs) total_profit
												FROM products p,
													departments d
												WHERE p.department_name = d.department_name
												GROUP BY d.department_id,
													d.department_name,
													d.over_head_costs`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					const result = conn.query(sqlQuery);

					conn.end();

					resolve(result);
				}).catch((error) => {
					if(error) {
						reject(error);
					}
				});
		}
	)
}