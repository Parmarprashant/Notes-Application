function logger(req, res, next){
const timeStamp = new Date();
console.log(timeStamp);
next();

}


module.exports = logger;