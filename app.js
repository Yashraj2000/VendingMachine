require('dotenv').config()  
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const vendorRouter = require('./routes/users');
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Vending Machine API",
      description: "Vending Machine API Information",
      contact: {
        name: "bankaraj00@gmail.com"
      },
      servers: ["http://localhost:3000"]
    }
  },
  // ['.routes/*.js']
  apis: ['./routes/*.js']
};

const app = express();
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



const addTodatabase = require('./addProductToDatabase');
// addTodatabase();
let url  = process.env.DATABASE_URL || 'mongodb://localhost:27017/vendingMachine';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false });
var db = mongoose.connection;
db.on('error',console.error.bind(console,"conncetion error"));
db.once('open',function(){
  console.log("connected")
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "This can be anyting",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/products', productRouter);
app.use('/vendors', vendorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
   
  if(err.kind=='ObjectId')
   err = "Please enter the correct Mongodb id to continue"
  console.log(err,"inside the app.js handler");
  res.status(err.status || 500);
  res.send({success:false,err});

});

module.exports = app;
