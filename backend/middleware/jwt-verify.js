import { response } from "../utils/response.js"
import jwt from 'jsonwebtoken'


export default function(req, res, next){
    const accessToken = req.headers.accesstoken
    if(!accessToken){ return response(res, false, 401, "access token invalid") }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        if(error.name === "TokenExpiredError"){return response(res, false, 401, "access token expired")}
        if(error.name === "JsonWebTokenError"){return response(res, false, 401, "access token invalid")}
        return response(res, false, 500, "server error")
    }
}