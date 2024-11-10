import Router from "./src/controller/Router.ts"
import HTTPMethod from "./src/types/HttpMethod.ts"
import Lobby, { type LobbySettings } from "./src/model/Lobby.ts"
import Html from "./src/Html.ts"
import "jsr:@std/dotenv/load"
import LobbyController from "./src/controller/LobbyController.ts"
import Uuid from "./src/Helpers/Uuid.ts"
import WebSocketController from "./src/controller/WebSocketController.ts"

if (!import.meta.main) {
    Deno.exit(1)
}

const address = Deno.env.get("SERVER_ADDRESS")
const port = Deno.env.get("SERVER_PORT")
const server_config = {
    port: port ? parseInt(port) : 8000,
    hostname: address ? address : "localhost",
}

const router = new Router()
const settings: LobbySettings = {
    name: "My Lobby",
    impostors: 1,
    id: Uuid.generate(),
}

const lobby = new Lobby(settings)
const lobbyController = new LobbyController(lobby)
const webSocketController = new WebSocketController(lobby)

router.registerRoute(HTTPMethod.GET, "/", () => {
    return new Html("menu-component").htmlResponse()
})

router.registerRoute(HTTPMethod.GET, "/lobby", () => {
    return new Html("lobby-component").htmlResponse()
})

router.registerRoute(HTTPMethod.GET, "/appjs", () => {
    return new Response(Deno.readFileSync("svelte/dist/components.js"), {
        headers: {
            "content-type": "application/javascript",
        },
    })
})

router.routeGroup("/api/lobby", HTTPMethod.GET, [
    ["", lobbyController.index.bind(lobbyController)],
    ["/webSocket", webSocketController.assignWebSocket.bind(webSocketController)],
    ["/getPlayers", lobbyController.getPlayers.bind(lobbyController)],
    ["/getLocation", lobbyController.getLocation.bind(lobbyController)],
    ["/kill", lobbyController.kill.bind(lobbyController)],
])

router.routeGroup("/api/lobby", HTTPMethod.POST, [
    ["/join", lobbyController.join.bind(lobbyController)],
    ["/startGame", lobbyController.startGame.bind(lobbyController)],
    ["/broadcast", webSocketController.broadcast.bind(webSocketController)],
])

const fn = router.handle.bind(router)

Deno.serve(
    server_config,
    fn,
)
