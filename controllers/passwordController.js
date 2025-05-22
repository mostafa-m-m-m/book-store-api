const asyncHandler = require('express-async-handler');
const { User ,validateChangePassword } = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
/**
 * @desc   Get Forgot Password View
 * @route  /password/forgot-password
 * @method GET
 * @access Public
 **/


module.exports.getForgotPassword = asyncHandler((req, res) => {
  res.render("forgot-password");
});


/**
 * @desc   Send Forgot Password Link
 * @route  /password/forgot-password
 * @method POST
 * @access Public
 **/


module.exports.sendForgetPasswordLink = asyncHandler(async(req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if(!user){
    return res.status(404).json({message: "User not found"});
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({email: user.email}, secret, {expiresIn: "10m"});
  const link = `${process.env.CLIENT_URL}/password/reset-password/${user._id}/${token}`;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

  try {
    await transporter.verify();
    console.log("Nodemailer transporter is ready");
  } catch (verifyError) {
    console.error("Transporter verification failed:", verifyError);
    return res.status(500).json({ message: "Email transporter error", error: verifyError.message });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: "Test Email",
    text: "Please click the link to reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your account. Please click the link below to set a new password:</p>
        <p style="margin: 20px 0;">
          <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `
  };

transporter.sendMail(mailOptions,function(error, info){
  if (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  } else {
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully" });
  }
});
res.render("link-send");
});
/**
 * @desc   get reset Password 
 * @route  /password/reset-password/:userId/:token
 * @method GET
 * @access Public
 **/


module.exports.getResetPasswordView = asyncHandler(async(req, res) => {
const user = await User.findById(req.params.userId);
if(!user){
    return res.status(404).json({message: "User not found"});
}
const secret = process.env.JWT_SECRET_KEY + user.password;  // Changed to JWT_SECRET_KEY
try{
    jwt.verify(req.params.token, secret);
    res.render("reset-password", {email : user.email});
} catch(error){
   console.log(error);
   res.json({message:"Error"});
}
});



/**
 * @desc    Reset Password  The Password
 * @route  /password/reset-password/:userId/:token
 * @method POST
 * @access Public
 **/


module.exports.restThePassword = asyncHandler(async(req, res) => {
const { error } = validateChangePassword(req.body);
if (error) {
    return res.status(400).json({ message: error.details[0].message });
}
  const user = await User.findById(req.params.userId);
if(!user){
    return res.status(404).json({message: "User not found"});
}
const secret = process.env.JWT_SECRET_KEY + user.password;  // Changed to JWT_SECRET_KEY
try{
    jwt.verify(req.params.token, secret);
   const salt = await bcrypt.genSalt(10);
    req.body.password =  await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");}
    catch(error){
   console.log(error);
   res.json({message:"Error"});
}
});