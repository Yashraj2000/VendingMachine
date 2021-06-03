const Product = require("../models/product");

module.exports = function cart(oldcart){
    
    this.items = oldcart.items || {};
    this.totalQty = oldcart.totalQty || 0;
    this.totalPrice = oldcart.totalPrice || 0;
    this.totalPaidAmount = oldcart.totalPaidAmount || 0;
    this.add = async function(item,id)
    {   
        const product = await Product.findById(id);
        var storedItem = this.items[id];
        console.log(storedItem)
        if(!storedItem)
        {
            storedItem = this.items[id] = {item,qty:0,price:0};
        }
        if((product.quantity-storedItem.qty-1)<0) throw "You cannot buy more products" // -1 to check if after adding if it is getting out of stock
        storedItem.qty++;
        storedItem.price = storedItem.item.price*storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;  // since we are adding only one item total cost of each item includes the quantity of the item as well
    };

    this.reduceByOne = function (id){
        if(!this.items[id]) throw "No such item in the cart ";
        this.items[id].qty--;
        this.totalQty--;
        this.totalPrice -= this.items[id].price;
        this.items[id].price-= this.items[id].item.price;

        if(this.items[id].qty<=0)
        {
            delete this.items[id];
        }
    }

    this.removeitem = function(id){

        if(!this.items[id]) throw "No such item in the cart ";
        this.totalQty-=this.items[id].qty;
        this.totalPrice-=this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function(){

        var arr = [];
        for(var id in this.items)
        {
            arr.push(this.items[id]);
        }
        return arr;
    }

}