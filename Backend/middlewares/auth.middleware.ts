import jwt from "jsonwebtoken";
import { serverConfig } from '../configs/server.config';

let verifyToken = (req: any, res: any, next: any) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.json({
          msg: 'not authorized',
          success: false
      });
    }
  
    jwt.verify(token, serverConfig.SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.json({
            msg: 'not authorized',
            success: false
        });
      }
      req.username = decoded.username;
      req.user_id = decoded._id;
      req.user_type = decoded.type;
      req.email = decoded.email;
      next();
    });
};

let addHeaders = (req: any, res: any, next: any) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
    next();    
};

const authMiddleware = {
    verifyToken,
    addHeaders
};

export {authMiddleware};