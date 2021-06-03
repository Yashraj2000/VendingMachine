const Product = require("../models/product");
const Cart    = require("../models/cart");
const Order   = require("../models/order");
const BaseClass = require("../middleware")

function calculateChange(totalPaid,totalValue){   
    return totalPaid-totalValue
}

function getTotal(dimes,nickels,pennys,quatars){
   let total = 0;
   if(dimes)
   {
       total+=(Number(dimes)*10);
   }
   if(pennys)
   {
       total+=(Number(pennys)*1);
   }
   if(nickels)
   {
       total+=(Number(nickels)*5);
   }
   if(quatars)
   {
       total+=(Number(quatars)*25);
   }
   return total;
}

function checkCartAfterDelete(cart){
   return cart.totalQty<=0 && cart.totalPaidAmount==0
}

function checkCartInSession(req){
    return (!req.session.cart || !req.session.cart.totalQty)
}
module.exports  =  class ProductsController extends BaseClass{
                
        constructor(){
            super()
        }

        findAllProduct = async (req,res)=>{
            const allProduct = await Product.find({});
            return res.status(200).send({success:true,allProduct});
        }

        AddMoney = async (req,res)=>{

            const {dimes,nickels,pennys,quatars} = req.body;
            let cart = new Cart(req.session.cart?req.session.cart:{});
            const total_paid_value = getTotal(dimes,nickels,pennys,quatars);
            if(total_paid_value==0)
            {
                return res.status(400).send({success:false,msg:"Please Pay to continue"});
            }
            cart.totalPaidAmount += total_paid_value;
            console.log(cart.totalPaidAmount,"This is the total value paid by the user");
            req.session.cart = cart;
            return res.status(200).send({success:true,msg:`Total amount of ${total_paid_value} has been added and total Amount is ${cart.totalPaidAmount}`});
    
        }

        buyProduct = async (req,res)=>{
            if(!req.session.cart)
            {
                  return res.status(400).send({success:false,msg:"Please pay first and then continue"});
            }
    
            if(!req.session.cart.totalQty)
            {
                return res.status(400).send({success:false,msg:"Please add an item and then continue"});
            }
            var cart = new Cart(req.session.cart);
    
            // const product_to_buy = await findProducts(product);
            // console.log(product_to_buy);
    
            if(cart.totalPaidAmount<cart.totalPrice)
            {    
                delete req.session.cart;
                return res.status(400).send({success:false,msg:"You did not pay enough, Coins are being returned"});
            }
    
            let change = calculateChange(cart.totalPaidAmount,cart.totalPrice);
            const newOrder = new Order({
                cart
             })
            //  console.log(cart,"inside the buy");
             const total_items_in_cart = cart.generateArray();
            //  console.log(total_items_in_cart[0].item,"Total items in cart");
             for(let element of total_items_in_cart)   // for of since it is an array of objects
             {
                 const product = await Product.findById(element.item._id);
                 product.quantity-=element.qty;
                 await product.save();
             }
            await newOrder.save();
            delete req.session.cart
            let msg  = `Products will be dispensed one by one` ;
            msg+= (change>0)?` change ${change} cents has been returned`:" no change to return ";
            return res.status(200).send({success:true,msg})
    
        }


        cancelPurchase = async(req,res)=>{    
            // const {id} = req.params;
            // const product = await Product.findById(id);
            // if(!product){
            //     return res.status(400).send({success:false,msg:"No such product found in the database"});
            // }   
            // const total_money_to_return = product.price;
            // product.quantity+=1;
            // await product.save();
            // return res.status(200).send({success:true,msg:`${total_money_to_return} cents has been returned`});
    
            if(req.session.cart){
                
                let msg = req.session.cart.totalPaidAmount + " cents has been successfully returned";
                delete req.session.cart
                return res.status(200).send({success:true,msg});
            }
    
            return res.status(400).send({success:false,msg:"Nothing to return Please add and continue shopping"});
        }


        AddToCart = async (req,res)=>{
            try {
                const {id} = req.params;
                console.log(req.session.cart,"This is session cart");
                const product = await Product.findById(id);
                if(!product) throw "No Such Product Found";
                console.log(product);
                if(!req.session.cart) throw "Please add money to continue";
                var cart = new Cart(req.session.cart);
               await cart.add(product,product._id);
                console.log(cart,"This is the cart");
                req.session.cart = cart;
            
                return res.status(200).send({success:true,msg:"Product added"});
            
              } catch (error) {
                console.log(error);
                return res.status(400).send({success:false,error});
              }
            
        }

        removeItem = async (req,res)=>{
            // change here
            // if(!req.session.cart || !req.session.cart.totalQty)
            if(checkCartInSession(req))
            {
                return res.status(400).send({success:false,msg:"No product in the cart"});
            }
            const {id} = req.params;
            let cart = new Cart(req.session.cart);
            cart.removeitem(id);
            req.session.cart = cart;
            if(checkCartAfterDelete(cart)) delete req.session.cart
            return res.status(200).send({success:true});
    
        }

        reduceByOne = async (req,res)=>{
            // if(!req.session.cart || !req.session.cart.totalQty)
            if(checkCartInSession(req))
            {
                return res.status(400).send({success:false,msg:"No product in the cart"});
            }
            const {id} = req.params;
            let cart = new Cart(req.session.cart);
            cart.reduceByOne(id);
            req.session.cart = cart;
            if(checkCartAfterDelete(cart)) delete req.session.cart
    
            return res.status(200).send({success:true});
        }

        AddToDatabase = async(req,res)=>{
            const newProduct = await Product.create(req.body);
            console.log(newProduct);
            return res.status(200).send({success:true,msg:"Product has been successfully added to the database"});
        }

        updateProduct = async(req,res)=>{
            const {name,price,quantity} = req.body;
            const {id} = req.params;
            const product = await Product.findById(id);
            if(name) product.name = name;
            if(price) product.price = Number(price);
            if(quantity) product.quantity = Number(quantity);
            await product.save();
            return res.status(200).send({success:true,msg:"Product has been updated successfully"});
    
        }

        deleteProduct = async(req,res)=>{
            const {id} = req.params;
            await Product.findByIdAndDelete(id);
            return res.status(200).send({success:true,msg:"Product has been deleted successfully"});
        }

        deleteOrders = async (req,res)=>{
            console.log("here");
            await Order.deleteMany({});
            return res.status(200).send({success:true,msg:"All the orders has been cleared"});
        }
}














