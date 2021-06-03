const Product = require("./models/product");

const coke = {
    name:"coke",
    price:25,
    quantity:5
};
const pepsi = {
    name:"pepsi",
    price:32,
    quantity:5
};
const soda = {
    name:"soda",
    price:47,
    quantity:5
};
async function addTodatabase()
{    
    await Product.remove({});
    await Product.create(coke);
    await Product.create(pepsi);
    await Product.create(soda);
    console.log("Product added");
}

// addTodatabase();
module.exports = addTodatabase;