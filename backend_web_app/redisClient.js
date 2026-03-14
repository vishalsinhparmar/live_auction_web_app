import dotenv from "dotenv";
import redis from "redis";

dotenv.config({
  path: "./.env",
});

const redisUrl = process.env.REDIS_URI;
const hasRedisConfig = Boolean(redisUrl);
export const redisClient = hasRedisConfig
  ? redis.createClient({
      url: redisUrl,
    })
  : null;

let redisAvailable = false;

if (redisClient) {
  redisClient.on("ready", () => {
    redisAvailable = true;
    console.log("redis connected successfully");
  });

  redisClient.on("end", () => {
    redisAvailable = false;
    console.warn("redis connection closed");
  });

  redisClient.on("error", (error) => {
    redisAvailable = false;
    console.warn("redis error:", error.message);
  });
}

export const isRedisReady = () => redisAvailable && redisClient?.isReady;

export const redisConnection = async () => {
  if (!redisClient) {
    console.warn("redis is disabled: REDIS_URI is missing");
    return false;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    redisAvailable = redisClient.isReady;
    return redisAvailable;
  } catch (error) {
    redisAvailable = false;
    console.warn("redis unavailable, falling back to local memory:", error.message);
    return false;
  }
};

export const redisGet = async (key) => {
  if (!isRedisReady()) return null;

  try {
    return await redisClient.get(key);
  } catch (error) {
    redisAvailable = false;
    console.warn(`redis get failed for ${key}:`, error.message);
    return null;
  }
};

export const redisSet = async (key, value, options) => {
  if (!isRedisReady()) return false;

  try {
    await redisClient.set(key, value, options);
    return true;
  } catch (error) {
    redisAvailable = false;
    console.warn(`redis set failed for ${key}:`, error.message);
    return false;
  }
};

export const redisIncr = async (key) => {
  if (!isRedisReady()) return null;

  try {
    return await redisClient.incr(key);
  } catch (error) {
    redisAvailable = false;
    console.warn(`redis incr failed for ${key}:`, error.message);
    return null;
  }
};

export const redisExpire = async (key, seconds) => {
  if (!isRedisReady()) return false;

  try {
    await redisClient.expire(key, seconds);
    return true;
  } catch (error) {
    redisAvailable = false;
    console.warn(`redis expire failed for ${key}:`, error.message);
    return false;
  }
};
