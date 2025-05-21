const asyncHandler = require('express-async-handler');


/**
 * @desc   Get  Forgot Password View
 * @route  /password/forgot-password
 * @method GET
 * @access Public
 **/


module.exports.getForgotPassword = asyncHandler(async (req, res) => {
  res.render("forgot-password");
});
