import jwt from "jsonwebtoken";
import { serverConfig } from '../configs/server.config';
let verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.json({
            msg: 'not authorized',
            success: false
        });
    }
    jwt.verify(token, serverConfig.SECRET, (err, decoded) => {
        if (err) {
            return res.json({
                msg: 'not authorized',
                success: false
            });
        }
        req.username = decoded.username;
        req.user_id = decoded._id;
        req.user_type = decoded.type;
        next();
    });
};
let addHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
};
const authMiddleware = {
    verifyToken,
    addHeaders
};
export { authMiddleware };
