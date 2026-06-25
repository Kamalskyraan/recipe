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
  userController.UpdateProfileData,
);

router.post(
  "/get-profile",

  /*  #swagger.tags = ['3.USER']
      #swagger.summary = 'Get Profile'
      #swagger.description = 'GET PROFILE DATA'

      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_id : "USR1782371436810602"
        }
      }

  */
  userController.GetProfileData,
);
export default router;
