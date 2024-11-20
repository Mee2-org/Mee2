import process from "node:process";
import { Logger } from "./helpers/Logger";
process.loadEnvFile(".env"); // Load the .env file.

export function validateEnv(debug?: boolean) {
    if (typeof debug === "undefined") debug = true;
    const logger = new Logger({ tag: "validator" });
    const { DISCORD_TOKEN, CLIENT_ID } = process.env;
    const DISCORD_TOKEN_REGEX = new RegExp(/(?<mfaToken>mfa\.[a-z0-9_-]{20,})|(?<basicToken>[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27})/i);
    let hits = 0;

    logger.info("fn(validateEnv)", "Checking for DISCORD_TOKEN variable...");

    /// Check if DISCORD_TOKEN is NOT undefined/string;
    if (DISCORD_TOKEN != undefined) {
        const match = DISCORD_TOKEN.match(DISCORD_TOKEN_REGEX);
        if (!match) {
            logger.error("fn(validateEnv)", `DISCORD_TOKEN is not a valid token.`);
            hits++;
        }
    } else {
        logger.error("fn(validateEnv)", `DISCORD_TOKEN is undefined, please make sure you have a DISCORD_TOKEN variable in your .env file.`);
        hits++
    }

    logger.info("fn(validateEnv)", `Checking for CLIENT_ID variable...`);

    if (CLIENT_ID != undefined) {
        if (CLIENT_ID.length < 17) {
            logger.error("fn(validateEnv)", `CLIENT_ID is not a valid Discord ID.`);
            hits++;
        }
    } else {
        logger.error("fn(validateEnv(", `CLIENT_ID is undefined, please make sure you have a CLIENT_ID variable in your .env file.`);
        hits++;
    }

    logger.success("fn(validateEnv)", `Completed validating. ${hits} validation warnings.`)
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            CLIENT_ID: string;
        }
    }
}