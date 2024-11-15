import Helpers from "../helpers/Helpers.ts"
import BroadcastMessage from "../model/BroadcastMessage.ts"
import Lobby from "../model/Lobby.ts"
import Player from "../model/Player.ts"
import WebSocketModel from "../model/WebSocket.ts"

class LobbyController {
    lobby: Lobby
    ws: WebSocketModel

    constructor(lobby: Lobby, ws: WebSocketModel) {
        this.lobby = lobby
        this.ws = ws
    }

    index(): Response {
        return new Response(this.lobby.index())
    }

    getPlayers(): Response {
        const players: Array<Player> = this.lobby.getPlayers()

        if (players.length === 0) {
            return new Response("No players", { status: 404 })
        }

        return new Response(JSON.stringify({ players: players }), {
            headers: {
                "content-type": "application/json",
            },
        })
    }

    async join(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { name?: string } = await Helpers.ReadableStreamToJsonObject(request.body)
        const name = body.name

        if (!name) {
            return new Response("Name is required", { status: 400 })
        }

        const player = new Player(name)

        if (!this.lobby.join(player)) {
            return new Response("Player not added", { status: 500 })
        }

        this.ws.broadcast(new BroadcastMessage(`${player.name} has joined the lobby`, "new_player"))

        return new Response(
            JSON.stringify({
                id: player.id,
                name: player.name,
            }),
            { status: 201 },
        )
    }

    async startGame(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { location?: string; host?: string } = await Helpers.ReadableStreamToJsonObject(
            request.body,
        )
        const location = body.location
        const host_id = body.host

        if (!location) {
            return new Response("where are we?", { status: 400 })
        }

        if (!host_id) {
            return new Response("who is the host?", { status: 400 })
        }

        const hosting_player = this.lobby.findPlayer(host_id)

        if (!hosting_player) {
            return new Response("Host not found", { status: 404 })
        }

        const result = this.lobby.startGame(hosting_player, location)

        if (!result[0]) {
            this.ws.broadcast(new BroadcastMessage("false", "game_started"))
            return new Response(result[1], { status: 412 })
        }

        this.ws.broadcast(new BroadcastMessage("true", "game_started"))
        return new Response(result[1], { status: 200 })
    }

    getRole(request: Request): Response {
        const params = new URL(request.url).searchParams
        const id = params.get("id")
        if (!id) {
            return new Response("Player Id is required", { status: 400 })
        }
        const player = this.lobby.findPlayer(id)

        if (!player) {
            return new Response("Player not found", { status: 404 })
        }

        return new Response(JSON.stringify({ role: player.role }))
    }

    getLocation(request: Request): Response {
        const params = new URL(request.url).searchParams
        const id = params.get("id")
        if (!id) {
            return new Response("Player Id is required", { status: 400 })
        }
        const player = this.lobby.findPlayer(id)
        if (!player) {
            return new Response("Player not found", { status: 404 })
        }

        return new Response(JSON.stringify({ location: player.location }))
    }

    leave(request: Request): Response {
        const params = new URL(request.url).searchParams
        const id = params.get("id")
        if (!id) {
            return new Response("Player Id is required", { status: 400 })
        }
        const player = this.lobby.findPlayer(id)

        if (!player) {
            return new Response("Player not found", { status: 404 })
        }

        if (!this.lobby.leave(player)) {
            return new Response("Player not removed", { status: 500 })
        }

        if (player.role === "host") {
            this.ws.broadcast(new BroadcastMessage("Host has left the lobby", "game_ended"))
        }

        this.ws.closeSocket(player.id)
        this.ws.broadcast(new BroadcastMessage(`${player.name} has left the lobby`, "player_left"))

        return new Response("Player removed", { status: 200 })
    }

    async endGame(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { host?: string } = await Helpers.ReadableStreamToJsonObject(
            request.body,
        )

        const host_id = body.host

        if (!host_id) {
            return new Response("Only the host should end the game", { status: 400 })
        }

        const hosting_player = this.lobby.findPlayer(host_id)

        if (!hosting_player) {
            return new Response("Host not found", { status: 404 })
        }
        if (hosting_player.role !== "host") {
            return new Response("Only the host should end the game", { status: 403 })
        }

        this.ws.broadcast(new BroadcastMessage("Game ended", "game_ended"))
        return new Response("Game ended", { status: 200 })
    }

    kill(_request: Request): Response {
        if (!this.lobby.kill()) {
            return new Response("Something went terribly wrong", { status: 500 })
        }
        return new Response("They are all dead now...", { status: 200 })
    }
}

export default LobbyController
