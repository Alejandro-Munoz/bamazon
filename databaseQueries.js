const mysql = require("mysql2/promise");
const connectionDetails = require("./connectionDetails");


exports.getProducts = function(viewType) {
	return new Promise(
		function(resolve, reject) {
			let sqlQuery = "";

			switch(viewType) {
		 		case "customer":
		 			sqlQuery = `SELECT item_id, product_name, department_name, price 
													FROM products ORDER BY item_id`;
					break;
				case "manager":
					sqlQuery = `SELECT item_id, product_name, department_name, price, stock_quantity 
													FROM products ORDER BY item_id`;
					break;
				default:
					throw("Invalid viewType encountered " + viewType);
			}

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
				const sqlQuery = `SELECT item_id, product_name, department_name, price, stock_quantity  
														FROM products
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
				const sqlQuery = `INSERT INTO products(product_name, department_name, department_id, price, stock_quantity)
														SELECT ?,
															?, 
															department_id,
															?, 
															?
														FROM departments
														WHERE department_name = ?`;

				mysql.createConnection(connectionDetails())
					.then((conn) => {
						// Execute query
						const results = conn.query(sqlQuery, [productName, deptName, price, stockQty, deptName]);

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
												WHERE p.department_id = d.department_id
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

exports.createDepartment = function(deptName, overHead) {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `INSERT INTO departments(department_name, over_head_costs)
													VALUES(?,?)`;

			mysql.createConnection(connectionDetails())
				.then((conn) => {
					const result = conn.query(sqlQuery,[deptName, overHead]);

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

exports.getDepartmentNames = function() {
	return new Promise(
		function(resolve, reject) {
			const sqlQuery = `SELECT department_name FROM departments`;

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