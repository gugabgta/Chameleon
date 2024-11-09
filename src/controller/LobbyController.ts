import Helpers from "../Helpers/Helpers.ts"
import Lobby from "../model/Lobby.ts"
import Player from "../model/Player.ts"
import WebSocketController from "./WebSocketController.ts"

class LobbyController {
    lobby: Lobby
    socket_connections: Map<string, WebSocket> = new Map()

    constructor(lobby: Lobby) {
        this.lobby = lobby
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

        return new Response(
            JSON.stringify({
                id: player.id,
                name: player.name,
            }),
            { status: 201 },
        )
    }

    assignWebSocket(request: Request): Response {
        const params = new URL(request.url).searchParams
        const id = params.get("id")
        if (!id) {
            return new Response("Player Id is required", { status: 400 })
        }

        const socket_handler = new WebSocketController(this.lobby)
        try {
            const { socket, response } = socket_handler.handleWebSocket(request)
            if (response.status !== 101) {
                return response
            }

            socket.addEventListener("message", (event) => {
                console.log(event)
            })

            socket.addEventListener("close", () => {
                console.log("WebSocket connection closed")
            })

            socket.addEventListener("error", (error) => {
                console.error(`WebSocket error:`, error)
            })

            socket.addEventListener("open", () => {
                console.log("WebSocket connection open")
            })

            this.socket_connections.set(id, socket)
            return response
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            return new Response(errorMessage, { status: 400 })
        }
    }

    async broadcast(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { message?: string } = await Helpers.ReadableStreamToJsonObject(request.body)
        const message = body.message

        if (!message) {
            return new Response("Message is required", { status: 400 })
        }

        this.socket_connections.forEach((socket) => {
            socket.send(message)
        })

        return new Response("Message sent", { status: 200 })
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
            return new Response(result[1], { status: 400 })
        }

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

    kill(_request: Request): Response {
        if (!this.lobby.kill()) {
            return new Response("Something went terribly wrong", { status: 500 })
        }
        return new Response("They are all dead now...", { status: 200 })
    }
}

export default LobbyController
