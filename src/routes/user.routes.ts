import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.post(
  "/update-profile",

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
  userController.UpdateProfileData
);

export default router;
