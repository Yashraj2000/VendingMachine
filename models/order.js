const mongoose = require('mongoose');
const Orderschema = new mongoose.Schema({
    cart: {type: Object, required: true},
    // name: {type: String, required: true},
    // paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', Orderschema);