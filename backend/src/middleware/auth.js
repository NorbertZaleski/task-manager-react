import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

async function protect(req,res,next){
    try {
        let token;

        //pobieramy token z headera
        if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
            
        if (!token){
            return res.status(401).json({
                message:"No authorization"
            })
        }

        //weryfikujemy token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //pobieramy/znajdujemy usera z tego tokena (bez hasła)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                message:"User doesn't exist"
            })
        }

        req.user = user;
        next();
    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({message:"Authorization error"})
    }
    
} 

export default protect;