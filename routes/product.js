const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/product')
const ProductsInstance = new ProductsController()

/**
 * @swagger
 * /products/:
 *   get:
 *     description: gets all the products in the Database/vendingMachine
 *     responses:
 *       200:
 *         description: Success true along with all the products
 * 
 */
router.get('/',ProductsInstance.errorHandler(ProductsInstance.findAllProduct));


/**
 * @swagger
 * /products/:
 *   post:
 *     description: use to add product to the database
 *     parameters:
 *      - name: name
 *        description: name of the product
 *        in: formData
 *        required: true
 *        type: string
 *      - name: price
 *        description: price of the product 
 *        in: formData
 *        required: true
 *        type: number
 *      - name: quantity
 *        description: total quantity of the product
 *        required: true
 *        type: number
 *        in: formData
 *     responses:
 *       200:
 *         description: success:true product has been added successfully
 */
router.post("/",ProductsInstance.isloggedin,ProductsInstance.errorHandler(ProductsInstance.AddToDatabase));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     description: use to update product in the database
 *     parameters:
 *      - name: name
 *        description: name of the product
 *        in: formData
 *        type: string
 *      - name: price
 *        description: price of the product 
 *        in: formData
 *        type: number
 *      - name: quantity
 *        description: total quantity of the product
 *        type: number
 *        in: formData
 *      - name: id 
 *        in: path
 *        description: Mongodb id
 *        required: true
 *     responses:
 *       200:
 *         description: success:true product has been updated successfully
 */
router.put("/:id",ProductsInstance.isloggedin,ProductsInstance.errorHandler(ProductsInstance.updateProduct));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     description: use to delete product in the database
 *     parameters:
 *      - name: id 
 *        in: path
 *        description: Mongodb id
 *        required: true
 *     responses:
 *       200:
 *         description: success:true product has been deleted successfully
 */
router.delete("/:id",ProductsInstance.isloggedin,ProductsInstance.errorHandler(ProductsInstance.deleteProduct));


/**
 * @swagger
 * /products/reset-orders:
 *   get:
 *     description: Resets the machine and drop all the order history
 *     responses:
 *       200:
 *         description: Success true along with all the orders has been cleared
 * 
 */
router.get("/reset-orders",ProductsInstance.isloggedin,ProductsInstance.errorHandler(ProductsInstance.deleteOrders));


/**
 * @swagger
 * /products/{id}/add-to-cart:
 *   get:
 *     description: Adds product in the cart
 *     parameters:
 *      - name: id 
 *        in: path
 *        description: Mongodb id
 *        required: true
 *     responses:
 *       200:
 *         description: success:true product has been added successfully
 */
router.get("/:id/add-to-cart",ProductsInstance.errorHandler(ProductsInstance.AddToCart));


/**
 * @swagger
 * /products/addMoney:
 *   post:
 *     description: use to add Money in the cart
 *     parameters:
 *      - name: dimes
 *        description: Total quantity of dime 1dime = 10cents 
 *        in: formData
 *        type: number
 *      - name: nickels
 *        description: Total quantity of nickels 1nickel = 5cents  
 *        in: formData
 *        type: number
 *      - name: pennys
 *        description: Total quantity of the pennys 1 penny = 1cent
 *        type: number
 *        in: formData
 *      - name: quatars
 *        description: Total quantity of the quatars 1 quatars = 25cent
 *        type: number
 *        in: formData
 *     responses:
 *       200:
 *         description: success:true Total money added along with total cart balance
 */

router.post("/addMoney",ProductsInstance.errorHandler(ProductsInstance.AddMoney));


/**
 * @swagger
 * /products/{id}/reduce-by-one:
 *   get:
 *     description: Reduce the item from the cart by one
 *     parameters:
 *      - name: id 
 *        in: path
 *        description: Mongodb id
 *        required: true
 *     responses:
 *       200:
 *         description: success:true
 */
router.get("/:id/reduce-by-one",ProductsInstance.errorHandler(ProductsInstance.reduceByOne));

/**
 * @swagger
 * /products/{id}/remove-item:
 *   get:
 *     description: Remove the item from the cart 
 *     parameters:
 *      - name: id 
 *        in: path
 *        description: Mongodb id
 *        required: true
 *     responses:
 *       200:
 *         description: success:true
 */
router.get("/:id/remove-item",ProductsInstance.errorHandler(ProductsInstance.removeItem));


/**
 * @swagger
 * /products/cancel-purchase:
 *   get:
 *     description: Cancels the order and returns the amount if paid 
 *     responses:
 *       200:
 *         description: success:true with total cents paid is returned
 */
router.get("/cancel-purchase",ProductsInstance.errorHandler(ProductsInstance.cancelPurchase));


/**
 * @swagger
 * /products/buy:
 *   get:
 *     description: Buys all the product present in the cart and dispatches product one by one
 *     responses:
 *       200:
 *         description: success:true with Remaning cents if more money is paid
 */
router.get('/buy',ProductsInstance.errorHandler(ProductsInstance.buyProduct));

module.exports = router;
