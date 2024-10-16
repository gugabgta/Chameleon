import Handler from "./src/controller/Handler.ts"
import HTTPMethod from "./src/types/HttpMethod.ts"
import Lobby from "./src/model/Lobby.ts"

if (!import.meta.main) {
    Deno.exit(1)
}

const address = Deno.env.get("SERVER_ADDRESS")
const server_config = {
    port: 8000,
    hostname: address,
}

const handler = new Handler()
const lobby = new Lobby({
    name: "My Lobby",
    impostors: 1,
})

handler.registerRoute(HTTPMethod.GET, "/", () => new Response("Hello World!"))
handler.registerRoute(HTTPMethod.GET, "/lobby", lobby.index.bind(lobby))
handler.registerRoute(HTTPMethod.POST, "/lobby/join", lobby.join.bind(lobby))
handler.registerRoute(
    HTTPMethod.POST,
    "/lobby/startGame",
    lobby.startGame.bind(lobby),
)
handler.registerRoute(
    HTTPMethod.GET,
    "/lobby/getLocation",
    lobby.getLocation.bind(lobby),
)

const fn = handler.handle.bind(handler)

Deno.serve(
    server_config,
    fn,
)
