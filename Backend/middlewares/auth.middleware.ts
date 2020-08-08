import jwt from "jsonwebtoken";
import { serverConfig } from '../configs/server.config';

let verifyToken = (req: any, res: any, next: any) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.json({
          msg: 'no token provided in headers'
      });
    }
  
    jwt.verify(token, serverConfig.SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.json({
            msg: 'you are not authorized to see content of this page!'
        });
      }
      req.username = decoded.username;
      req.password = decoded.password;
      req.email = decoded.email; //provide information that you got from decoded token.      
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