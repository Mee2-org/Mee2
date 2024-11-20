import { ClientEvents } from "discord.js";

export interface Event {
    data: EventData
    run: (...args: unknown[]) => unknown;
}

export interface EventData{
    name: keyof ClientEvents;
    once: boolean;
}

export function createEvent<EN extends keyof ClientEvents>(data: EventData, run: (...args: ClientEvents[EN]) => unknown) {
    return {
        data,
        run
    }
}