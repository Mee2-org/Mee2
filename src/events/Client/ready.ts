import { createEvent, deployApplicationCommands } from "../../internal/helpers";

export default createEvent<"ready">({
    name: "ready",
    once: true
}, async (client) => {
    client.logger.info("event(ready)", `${client.user.username} is ready!`);
    await deployApplicationCommands(client)
})