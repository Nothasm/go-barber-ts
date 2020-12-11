import * as BeeQueue from "bee-queue";
import CancellationMail from "../jobs/CancellationMail";

const jobs = [ CancellationMail ];

class Queue {
    private queues: {
        [key: string]: {
            bee: BeeQueue
            handle: any
        }
    } = {};

    constructor() {
        this.init();
    }

    init() {
        console.log("Queue initiated");
        jobs.forEach(({key, handle}) => {
            this.queues[key] = {
                bee: new BeeQueue(key, {
                    redis: {
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT
                    }
                }),
                handle
            };
        });
    }

    add(queue: string, job: any) {
        return this.queues[queue].bee.createJob(job).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.on("failed", this.handleFailure).process(handle);
        });
    }

    handleFailure(job: any, err: any) {
        console.log(`Queue ${job.queue.name}: FAILED`, err)
    }
}

export default new Queue();