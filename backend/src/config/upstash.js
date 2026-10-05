import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { configDotenv } from "dotenv";

configDotenv();

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60s"),
    prefix: "task-manager",
});

export default ratelimit;