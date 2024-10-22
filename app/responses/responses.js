module.exports = {
   successResponse: (res, message, data = null) => {
       res.status(200).json({
           status: 'success',
           message,
           data
       });
   },

   errorResponse: (res, message, data = null) => {
       res.status(400).json({
           status: 'error',
           message,
           data
       });
   },

   notFoundResponse: (res, message, data = null) => {
       res.status(404).json({
           status: 'error',
           message,
           data
       });
   },

   badRequestResponse: (res, message, data = null) => {
       res.status(400).json({
           status: 'error',
           message,
           data
       });
   },

   expiredTokenResponse: (res, message, data = null) => {
       res.status(401).json({
           status: 'error',
           message,
           data
       });
   },

   invalidTokenResponse: (res, message, data = null) => {
       res.status(403).json({
           status: 'Invalid Token!',
           message,
           data
       })
   }
}