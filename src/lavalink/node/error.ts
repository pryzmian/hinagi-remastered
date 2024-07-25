import { Lavalink } from "../../structures/Lavalink";

export default new Lavalink({
    name: "error",
    type: "node",
    run: (client, node, error) => client.logger.error(`The node: ${node.options.id} has an error: ${JSON.stringify(error, null, 4)}`),
});
