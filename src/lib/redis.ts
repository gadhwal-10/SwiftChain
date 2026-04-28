import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as { redis: Redis };

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
  });

  client.on('connect', () => {
    console.log('[Redis] Connected successfully');
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// ─── Helper Methods ─────────────────────────────────────────────────────────

const RIDER_LOCATION_PREFIX = 'rider:location:';
const RIDER_LOCATION_TTL = 300; // 5 minutes

export async function setRiderLocation(riderId: string, lat: number, lng: number): Promise<void> {
  const key = `${RIDER_LOCATION_PREFIX}${riderId}`;
  await redis.setex(key, RIDER_LOCATION_TTL, JSON.stringify({ lat, lng, updatedAt: Date.now() }));
}

export async function getRiderLocation(riderId: string): Promise<{ lat: number; lng: number; updatedAt: number } | null> {
  const key = `${RIDER_LOCATION_PREFIX}${riderId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function getAllRiderLocations(): Promise<Record<string, { lat: number; lng: number; updatedAt: number }>> {
  const keys = await redis.keys(`${RIDER_LOCATION_PREFIX}*`);
  if (keys.length === 0) return {};

  const pipeline = redis.pipeline();
  keys.forEach((key) => pipeline.get(key));
  const results = await pipeline.exec();

  const locations: Record<string, { lat: number; lng: number; updatedAt: number }> = {};
  keys.forEach((key, i) => {
    const riderId = key.replace(RIDER_LOCATION_PREFIX, '');
    const data = results?.[i]?.[1] as string | null;
    if (data) locations[riderId] = JSON.parse(data);
  });

  return locations;
}

export async function publishEvent(channel: string, data: unknown): Promise<void> {
  await redis.publish(channel, JSON.stringify(data));
}

export default redis;
