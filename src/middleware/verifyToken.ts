// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { AuthModel } from "../models/auth.model";
// import { sendResponse } from "../utils/helper";

// dotenv.config();

// const authMdl = new AuthModel();

// export const verifyToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       return sendResponse(
//         res,
//         401,
//         0,
//         [],
//         "Unauthorized",
//         []
//       );
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     );

//     const device = await authMdl.getActiveDevice(
//       decoded.user_id,
//       decoded.device_id
//     );

//     if (!device) {
//       return sendResponse(
//         res,
//         401,
//         0,
//         [],
//         "Device logged out",
//         []
//       );
//     }

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.log("Verify Token Error:", error);

//     return sendResponse(
//       res,
//       401,
//       0,
//       [],
//       "Invalid or Expired Token",
//       []
//     );
//   }
// };