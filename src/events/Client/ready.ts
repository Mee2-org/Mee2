import { createEvent, registerApplicationCommands } from "@/internal/helpers";

export default createEvent<"ready">({
    name: "ready",
    once: true
}, (client) => {
    client.logger.info(`${client.user.username} is connected to Discord API & Ready!`);

    registerApplicationCommands(client)
})