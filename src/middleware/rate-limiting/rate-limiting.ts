import * as express from 'express';
import { LeakyBucketAlgorithm } from './leaky-bucket-algorithm';

export class RateLimitingMiddleware {

    private static leakyBucketsAlgorithms: {} = {};

    public static async limit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const currentTimestamp: Date = new Date();

            const ipAddress: string = req.get('Authorization') || req.get('X-Real-IP') || 'unknown';

            if (!RateLimitingMiddleware.leakyBucketsAlgorithms[ipAddress]) {
                RateLimitingMiddleware.leakyBucketsAlgorithms[ipAddress] = new LeakyBucketAlgorithm(375, 20); // 20 drops per 7.5 seconds and 2.667 drops per second
            }

            const leakyBucketAlgorithm: LeakyBucketAlgorithm = RateLimitingMiddleware.leakyBucketsAlgorithms[ipAddress];

            if (leakyBucketAlgorithm.addDrop()) {
                next();
                return;
            }

            const retryAfterInMilliseconds: number = leakyBucketAlgorithm.getTimestampOfLastDropLeak().getTime() + leakyBucketAlgorithm.getMillisecondsBetweenDropLeaks() - currentTimestamp.getTime();

            res.set('Retry-After', (retryAfterInMilliseconds / 1000).toString());
            res.status(429).end();
        } catch (err) {
            console.log(`${req.url} - 400`);
            res.status(400).end();
        }
    }
}
