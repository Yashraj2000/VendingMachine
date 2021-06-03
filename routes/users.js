const express = require('express');
const router = express.Router();
const {getLogin,postlogin,getlogout,postregister} = require("../controllers/user");
const {errorHandler} = require("../middleware")



// router.get('/login',getLogin);

/**
 * @swagger
 * /vendors/login:
 *   post:
 *     description: logs vendor in
 *     parameters:
 *      - name: username
 *        description: username to login
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: password to login
 *        in: formData
 *        required: true
 *        type: string 
 *     responses:
 *       200:
 *         description: success:true logged in successfully
 */
router.post('/login', errorHandler(postlogin));


/**
 * @swagger
 * /vendors/register:
 *   post:
 *     description: use to register the vendor
 *     parameters:
 *      - name: username
 *        description: username to register with
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: password to register with
 *        in: formData
 *        required: true
 *        type: string 
 *     responses:
 *       200:
 *         description: success:true logged in successfully
 */
router.post('/register', errorHandler(postregister));


/**
 * @swagger
 * /vendors/logout:
 *   get:
 *     description: logs out the vendor
 *     responses:
 *       200:
 *         description: Success true logged out successfully
 * 
 */
router.get('/logout', errorHandler(getlogout));




module.exports = router;
