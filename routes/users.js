const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/user");

const AuthInstance = new AuthController();


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
router.post('/login', AuthInstance.errorHandler(AuthInstance.postlogin));


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
router.post('/register', AuthInstance.errorHandler(AuthInstance.postregister));


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
router.get('/logout', AuthInstance.errorHandler(AuthInstance.getlogout));




module.exports = router;
