"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/create-guest", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Create Guest User'
    #swagger.description = 'Create temporary guest account'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        device_id: 'ANDROID_123456',
        country: 'India',
        food_type: 'nonveg',
        prefer_lang: 'en'
      }
    }

    #swagger.responses[200] = {
      description: 'Guest Created',
      schema: {
        success: 1,
        data: {
          user_id: 'TEMP_1750000000000'
        },
        message: 'Guest Created'
      }
    }
*/
auth_controller_1.AuthController.createGuest);
router.post("/request-otp", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Request OTP'
    #swagger.description = 'Send OTP to email address'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'test@gmail.com',
        type : "1"
      }
    }

    #swagger.responses[200] = {
      description: 'OTP Sent Successfully',
      schema: {
        success: 1,
        data: [],
        message: 'OTP Sent Successfully'
      }
    }

    #swagger.responses[400] = {
      description: 'Validation Error',
      schema: {
        success: 0,
        data: [],
        message: 'Email is required'
      }
    }
*/
auth_controller_1.AuthController.requestOtp);
router.post("/verify-otp", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Verify OTP'
    #swagger.description = 'Verify OTP'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'test@gmail.com',
        otp : '1234'
      }
    }

    #swagger.responses[200] = {
      description: 'OTP Veified Successfully',
      schema: {
        success: 1,
        data: [],
        message: 'OTP Verified Successfully'
      }
    }

    }
*/
auth_controller_1.AuthController.verifyOtp);
router.post("/signup", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Sign UP'
    #swagger.description = 'User Signup by email '

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        user_name: 'kamalesh',
        email : 'abc@gmail.com',
        password : "12345678",
        device_id : "Android1234",
        device_type: "android or IOs",
        device_token : "FCM12345"
      }
    }

    #swagger.responses[200] = {
      description: 'User Sign up Successfully',
      schema: {
        success: 1,
        data: [],
        message: 'User Sign up Successfully'
      }
    }

    }
*/
auth_controller_1.AuthController.signup);
router.post("/login", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'User Login'
    #swagger.description = 'Login using email and password'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'abc@gmail.com',
        password: '12345678',
        device_id: 'android_12345',
        device_type: 'android',
        device_token: 'FCM12345'
      }
    }

    #swagger.responses[200] = {
      description: 'Login Successful',
      schema: {
        success: 1,
        data: [{
          token: 'jwt_token'
        }],
        message: 'Login successful'
      }
    }
*/
auth_controller_1.AuthController.login);
router.post("/reset-password", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Password Updated successfully'
    #swagger.description = 'Password updated sucessfully'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'abc@gmail.com',
        password: '12345678'
      }
    }

    #swagger.responses[200] = {
      description: 'Password updated Successful',
      schema: {
        success: 1,
        data: [],
        message: 'Password updated successful'
      }
    }
*/
auth_controller_1.AuthController.resetPassword);
router.post("/google-login", 
/*  #swagger.tags = ['1.Auth']
    #swagger.summary = 'Google Login'
    #swagger.description = 'Login using Google ID Token'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        google_token: 'eyJhbGciOiJSUzI1NiIs...',
        device_id: 'android_12345',
        device_type: 'android',
        device_token: 'FCM12345'
      }
    }

    #swagger.responses[200] = {
      description: 'Google Login Successful',
      schema: {
        success: 1,
        data: [{
          token: 'jwt_token'
        }],
        message: 'Login successful'
      }
    }
*/
auth_controller_1.AuthController.googleLogin);
exports.default = router;
