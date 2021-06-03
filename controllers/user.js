const User = require("../models/user")
const util = require("util");



module.exports = {
    async postlogin(req,res){
        const {username,password} = req.body;
        try{
            if(req.isAuthenticated()) throw "Please logout to continue"
            const{user,error}  = await User.authenticate()(username,password);
            if(error)throw error
            const login =  util.promisify(req.login.bind(req));
            await login(user);
            console.log(req.user,"after loggin in ")
            return res.status(200).send({success:true,msg:"You are successfully logged in"})

        }catch(error){
            console.log(error);
            return res.status(400).send({success:false,msg:"Email or password is incorrect"});
        }
    },
    async getlogout(req,res){

        if(req.isAuthenticated()){
            req.logout();
            return res.status(200).send({success:true,msg:"You are successfully logged out"})
        }
        throw "Please login to continue"
    },
    async postregister(req,res){
        try {
            if(req.isAuthenticated()) throw "Please logout to continue"
            const users = await User.register(new User(req.body), req.body.password);
             console.log(users)
             const login =  util.promisify(req.login.bind(req));
             await login(users);
             console.log(req.user,"user object after loggin in ");
             return res.status(200).send({success:true,msg:"You are successfully logged in"})
        } catch (error) {
            console.log(error);
            return res.status(400).send({success:false,error});
        }
    }
}