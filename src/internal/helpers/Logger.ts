// {date} <<TAG>> [CTX]
//     > {message}

import chalk from "chalk";

interface LoggerOptions {
    tag?: string;
}

export class Logger {
    private context: LoggerOptions;

    public constructor(options?: LoggerOptions) {
        this.context = options ?? { tag: "logger" }
    }

    public success(ctx: string, ...message: any[]) {
        console.info(
            chalk.black(this.date()),
            chalk.bgBlue("  SUCCESS  "),
            chalk.magentaBright(`<<${this.context.tag}>>`),
            chalk.red("[", chalk.green(ctx), "]"), "\n",
            `     ${chalk.greenBright(">>")}`, ...message
        )
    }

    public info(ctx: string, ...message: any[]) {
        console.info(
            chalk.black(this.date()),
            chalk.bgBlue("  INFO  "),
            chalk.magentaBright(`<<${this.context.tag}>>`),
            chalk.red("[", chalk.cyan(ctx), "]"), "\n",
            `     ${chalk.cyanBright(">>")}`, ...message
        );
    }

    public warn(ctx: string, ...message: any[]) {
        console.warn(
            chalk.black(this.date()),
            chalk.bgBlue("  WARN  "),
            chalk.magentaBright(`<<${this.context.tag}>>`),
            chalk.red("[", chalk.yellow(ctx), "]"), "\n",
            `     ${chalk.yellowBright(">>")}`, ...message
        );
    }

    public error(ctx: string, ...message: any[]) {
        console.error(
            chalk.black(this.date()),
            chalk.bgBlue("  ERROR  "),
            chalk.magentaBright(`<<${this.context.tag}>>`),
            chalk.red("[", chalk.red(ctx), "]"), "\n",
            `     ${chalk.redBright(">>")}`, ...message
        );
    }

    private date() {
        const date = new Date()
        return `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;
    }
}