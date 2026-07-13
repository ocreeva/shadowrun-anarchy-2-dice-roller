import pino from 'pino';

const logger = pino({
    formatters: {
        level: label => {
            return { level: label };
        },
    },
}, pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
    },
}));

export class Log {
    public static info(message: string, obj?: unknown): void {
        if (obj) {
            logger.info(obj, message);
        } else {
            logger.info(message);
        }
    }

    public static warn(message: string, obj?: unknown): void {
        if (obj) {
            logger.warn(obj, message);
        } else {
            logger.warn(message);
        }
    }

    public static error(message: string, obj?: unknown): void {
        if (obj) {
            logger.error(obj, message);
        } else {
            logger.error(message);
        }
    }
}
