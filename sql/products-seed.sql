LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `department_id`, `price`, `stock_quantity`, `product_sales`)
VALUES
	(1,'Blue Ring','PowerUps',4,250.00,19,0.00),
	(2,'Red Ring','PowerUps',4,250.00,2,0.00),
	(3,'Wooden Sword','Weapons',5,500.00,1,0.00),
	(4,'White Sword','Weapons',5,700.00,1,0.00),
	(5,'Magical Sword','Weapons',5,2500.00,1,0.00),
	(6,'Small Shield','Weapons',5,300.00,1,0.00),
	(7,'Magical Shield','Weapons',5,1000.00,1,0.00),
	(8,'Boomerang','Weapons',5,300.00,1,0.00),
	(9,'Magical Boomerang','Weapons',5,750.00,1,0.00),
	(10,'Bomb','Weapons',5,100.00,500,0.00),
	(11,'Book of Magic','Magic & Potions',3,400.00,10,0.00),
	(12,'Magical Rod','PowerUps',4,400.00,10,0.00),
	(13,'Arrow','Weapons',5,50.00,5000,0.00),
	(14,'Silver Arrow','Weapons',5,200.00,2000,0.00),
	(15,'Bow','Weapons',5,700.00,5,0.00),
	(16,'Raft','Items',2,500.00,8,0.00),
	(17,'Stepladder','Items',2,300.00,8,0.00),
	(18,'Heart Container','Health',1,250.00,100,0.00),
	(19,'Blue Candle','Items',2,300.00,5,0.00),
	(20,'Red Candle','Items',2,400.00,5,0.00),
	(21,'Recorder','Items',2,400.00,5,0.00),
	(22,'Power Bracelet','PowerUps',4,300.00,5,0.00),
	(23,'Magical Key','Items',2,600.00,10,0.00),
	(24,'Food','Health',1,200.00,200,0.00),
	(25,'Red Potion','Health',1,100.00,50,0.00),
	(26,'Blue Potion','Magic & Potions',3,150.00,10,0.00),
	(27,'Fairy','Health',1,100.00,100,0.00);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;