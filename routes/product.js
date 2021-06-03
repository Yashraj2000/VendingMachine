const express = require('express');
const router = express.Router();
const {errorHandler,isloggedin} = require("../middleware")
const {buyProduct,findAllProduct,AddToCart,reduceByOne,
      removeItem,AddMoney,cancelPurchase,AddToDatabase,
      updateProduct,deleteProduct,deleteOrders} = require('../controllers/product')

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
router.get('/',errorHandler(findAllProduct));


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
router.post("/",isloggedin,errorHandler(AddToDatabase));

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
router.put("/:id",isloggedin,errorHandler(updateProduct));

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
router.delete("/:id",isloggedin,errorHandler(deleteProduct));


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
router.get("/reset-orders",isloggedin,errorHandler(deleteOrders));


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
router.get("/:id/add-to-cart",errorHandler(AddToCart));


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

router.post("/addMoney",errorHandler(AddMoney));


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
router.get("/:id/reduce-by-one",errorHandler(reduceByOne));

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
router.get("/:id/remove-item",errorHandler(removeItem));


/**
 * @swagger
 * /products/cancel-purchase:
 *   get:
 *     description: Cancels the order and returns the amount if paid 
 *     responses:
 *       200:
 *         description: success:true with total cents paid is returned
 */
router.get("/cancel-purchase",errorHandler(cancelPurchase));


/**
 * @swagger
 * /products/buy:
 *   get:
 *     description: Buys all the product present in the cart and dispatches product one by one
 *     responses:
 *       200:
 *         description: success:true with Remaning cents if more money is paid
 */
router.get('/buy',errorHandler(buyProduct));

module.exports = router;
