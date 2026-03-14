import {
  isRedisReady,
  redisExpire,
  redisIncr,
} from "../../redisClient.js";
import { sendErrorMessage } from "../utils/sendMessage.js";

const WINDOW_IN_SECONDS = 60;
const MAX_ATTEMPTS = 5;
const memoryRateLimitStore = new Map();

const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  req.ip ||
  "unknown";

const incrementMemoryAttempts = (key) => {
  const now = Date.now();
  const existing = memoryRateLimitStore.get(key);

  if (!existing || existing.expiresAt <= now) {
    memoryRateLimitStore.set(key, {
      count: 1,
      expiresAt: now + WINDOW_IN_SECONDS * 1000,
    });
    return 1;
  }

  existing.count += 1;
  memoryRateLimitStore.set(key, existing);
  return existing.count;
};

export const rateLimittingAuth = async (req, res, next) => {
  const ip = getClientIp(req);
  const key = `login:attempts:${ip}`;

  try {
    let count;

    if (isRedisReady()) {
      count = await redisIncr(key);

      if (count === 1) {
        await redisExpire(key, WINDOW_IN_SECONDS);
      }
    } else {
      count = incrementMemoryAttempts(key);
    }

    if (count > MAX_ATTEMPTS) {
      return sendErrorMessage(
        res,
        "Too many login attempts. Please wait a minute and try again.",
        429
      );
    }

    next();
  } catch (err) {
    console.log("error happen in this rateLimittingAuth", err.message);
    next();
  }
};
