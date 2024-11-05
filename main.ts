import Router from "./src/controller/Router.ts"
import HTTPMethod from "./src/types/HttpMethod.ts"
import Lobby from "./src/model/Lobby.ts"
import Html from "./src/Html.ts"
import "jsr:@std/dotenv/load"

if (!import.meta.main) {
    Deno.exit(1)
}

const address = Deno.env.get("SERVER_ADDRESS")
const server_config = {
    port: 8000,
    hostname: address,
}

const router = new Router()
const lobby = new Lobby({
    name: "My Lobby",
    impostors: 1,
})

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
    ["", lobby.index.bind(lobby)],
    ["/getPlayers", lobby.getPlayers.bind(lobby)],
    ["/getLocation", lobby.getLocation.bind(lobby)],
    ['/kill', lobby.kill.bind(lobby)],
])

router.routeGroup("/api/lobby", HTTPMethod.POST, [
    ["/join", lobby.join.bind(lobby)],
    ["/startGame", lobby.startGame.bind(lobby)],
])

const fn = router.handle.bind(router)

Deno.serve(
    server_config,
    fn,
)
