import { Request, Response, NextFunction } from 'express';
import Redis, { Redis as RedisClient } from 'ioredis';
import AppError from '@shared/errors/AppError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import cacheConfig from '@config/cache';

const client: RedisClient = new Redis(cacheConfig.config.redis);

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 1,
  blockDuration: 30,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
