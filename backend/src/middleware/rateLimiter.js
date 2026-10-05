import ratelimit from "../config/upstash.js"

const rateLimiter = async (req,res,next) => {
    try {
        //bo ratelimiter będzie przed autentykacją czyli req.user jeszcze nie istnieje, więc gdy zalogowany patrzymy na id usera, jeśli nie to na ip
        const identifier = req.user?.id ?? req.ip;
        const {success} = await ratelimit.limit(identifier);
        if (!success) {
            return res.status(429).json({
                message:"too many requests, please try again later"
            })
        }
        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
};

export default rateLimiter;