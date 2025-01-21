module.exports = (req, res, next) => {
   console.log('Middleware d\'authentification');
   next();
};

