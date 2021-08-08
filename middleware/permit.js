const permit = (...roles) => {
   return (request, response, next) => {
      if (!request.user) {
         return response.status(401).json({message: "Unauthenticated!!"})
      }
      if (!roles.includes(request.user.role)) {
         return response.status(403).send("Unauthorized!")
      }

      next()
   }
}


module.exports = permit
