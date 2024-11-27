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

    public debug(ctx: string, ...message: unknown[]) {
        console.debug(
            chalk.black(this.date()),
            chalk.bgYellow("  DEBUG  "),
            chalk.magentaBright(`«${this.context.tag}»`),
            chalk.red("[" + chalk.dim(ctx) + "]") + ":",
            ...message
        )
    }

    public success(ctx: string, ...message: unknown[]) {
        console.info(
            chalk.black(this.date()),
            chalk.bgGrey("  SUCCESS  "),
            chalk.magentaBright(`«${this.context.tag}»`),
            chalk.red("[" + chalk.green(ctx) + "]") + ":",
            ...message
        )
    }

    public info(ctx: string, ...message: unknown[]) {
        console.info(
            chalk.black(this.date()),
            chalk.bgGrey("  INFO  "),
            chalk.magentaBright(`«${this.context.tag}»`),
            chalk.red("[" + chalk.cyan(ctx) + "]")+ ":",
            ...message
        );
    }

    public warn(ctx: string, ...message: unknown[]) {
        console.warn(
            chalk.black(this.date()),
            chalk.bgGrey("  WARN  "),
            chalk.magentaBright(`«${this.context.tag}»`),
            chalk.red("[" + chalk.yellow(ctx) + "]") + ":",
            ...message
        );
    }

    public error(ctx: string, ...message: unknown[]) {
        console.error(
            chalk.black(this.date()),
            chalk.bgGrey("  ERROR  "),
            chalk.magentaBright(`«${this.context.tag}»`),
            chalk.red("[" + chalk.red(ctx) + "]") + ":",
            ...message
        );
    }

    private date() {
        const date = new Date()
        return `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;
    }
}