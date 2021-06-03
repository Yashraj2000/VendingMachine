
module.exports = {
    errorHandler: (fn) => (req, res, next)=>Promise.resolve(fn(req,res,next)).catch(next),   
    isloggedin: (req,res,next)=>{
        if(req.isAuthenticated()){
          return next()
        };
        return res.status(401).send({success:false,msg:"Please log in to continue"});
      }
}
