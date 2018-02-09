LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;

INSERT INTO `departments` (`department_id`, `department_name`, `over_head_costs`)
VALUES
	(1,'Health',1000.00),
	(2,'Items',1500.00),
	(3,'Magic & Potions',1700.00),
	(4,'PowerUps',2000.00),
	(5,'Weapons',4000.00);

/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;