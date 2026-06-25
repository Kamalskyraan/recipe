"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post("/update-profile", 
/*  #swagger.tags = ['3.USER']
    #swagger.summary = 'Update Profile'
    #swagger.description = 'UPDATE PROFILE'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        user_id : "USR1782371436810602",
        user_name : "kamalesh",
        email : "test@gmail.com",
        profile_img : "1"
      }
    }

*/
user_controller_1.userController.UpdateProfileData);
exports.default = router;
