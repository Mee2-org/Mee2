export { ReadEvent as Event } from "./events";
export { ReadCommand as Command } from "./commands";

export function RemoveTSPrefix(str: string) {
    return str.replace(".ts", "");
}