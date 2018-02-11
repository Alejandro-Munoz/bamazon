# bamazon

## What is it?
A Node.js based terminal store front utilizing a MySQL database.

The application provides 3 views:

	* Customer
	* Manager
	* Supervisor

Refer to the [**Show Me**](#show-me) section below for examples on how to use each of the views.

## How do I use it?

Clone this repository and then run:

`npm install`

Then, to run the applicaton run:

`node index`

## Show Me

After execuring `node index`, you will be presented with a list of view options to choose from.

![index image](images/for_readme/node_index.png)

## Customer View

When the Customer view is selected, you will be presented with a table of all the items currently for sale.

![customer enter id](images/for_readme/customer_enterID.png)

After entering a valid item ID, you will be asked to provide the amount to purchase.

![customer_enter_qty](images/for_readme/customer_validID.png)

If the store has enough inventory on hand to complete your order, you will be presented with an order summary.

![customer order summary](images/for_readme/customer_successfulOrder.png)

### Invalid Input Handling

During order processing, if an invalid item ID/quantity value is provided, you will not be allowed to proceed until a valid item ID/quantity is entered.

![invalid item id](images/for_readme/customer_invalidID.png)

![invalid quantity](images/for_readme/customer_invalidInventoryAmount.png)

If the store does not have enough quanity on hand, the order will not be processed.

![not enough quantity](images/for_readme/customer_notEnoughInventory.png)

## Manager View

The Manager View provides you with the following choices.

![manager choices](images/for_readme/manager_choices.png)

### View Products for Sale

Provides you with a table of the current items for sale in the store.

![manager products for sale](images/for_readme/manager_viewProducts.png)

### View Low Inventory

Provides you with a table of the current items in the store with a quanity less than 5.

![manager low inventory](images/for_readme/manager_lowInventory.png)

### Add to Inventory

Provides you with the ability to add inventory to a currently existing item ID.

![manager add to inventory](images/for_readme/manager_addToInventoryItemId.png)

You will then be prompted to add the amount of inventory to add.

![manager add to inventory](images/for_readme/manager_addToInventory.png)

In the manager view, you will also be able to add a new products to the store.

![manager add product](images/for_readme/manager_addNewProduct.png)

### Invalid Input Handling

In the ** Add to Inventory ** view, if an attempt is made to update an item ID which does not exists, you will be presented with an error.

![add to inventory invalid id](images/for_readme/manager_addToInventoryError.png)

## Supervisor View

The Supervisor view allows you the following options.

![supervisor choices](images/for_readme/supervisor_choices.png)

### View Product Sales by Department

Provides you with a table of the total sales by available departments.

![supervisor total sales](images/for_readme/supervisor_viewProductSales.png)

### Create Department

Allows you to create a new department.

![supervisor create dept](images/for_readme/supervisor_createDepartment.png)
