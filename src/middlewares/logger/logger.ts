import { Logger as WLogger, createLogger, format } from 'winston'


class Logger {
    private logger: WLogger;

    constructor() {
        this.logger = createLogger({ format: format.json() });
    }

    public info(message: string) {
        this.logger.info(message)
    }

    public error(message: string) {
        this.logger.error(message);
    }

    public warning(message: string) {
        this.logger.warning(message);
    }

    public debug(message: string) {
        this.logger.debug(message);
    }

}

export default new Logger();