import type Lobby from "../model/Lobby.ts"

class WebSocketController {
    lobby: Lobby
    connections: WebSocket[]

    constructor(lobby: Lobby) {
        this.lobby = lobby
        this.connections = []
    }

    handleWebSocket(request: Request): Response {
        if (request.headers.get("upgrade") != "websocket") {
            return new Response("no upgrade header", { status: 501 })
        }
        const { socket, response } = Deno.upgradeWebSocket(request)
        this.connections.push(socket)
        return response
    }

    broadcast(request: Request): Response {
        const params = new URL(request.url).searchParams

        if (!params) {
            return new Response("Invalid request body", { status: 400 })
        }

        const message = params.get("message")

        if (!message) {
            return new Response("Message is required", { status: 400 })
        }

        this.connections.forEach((conn) => {
            conn.send(message);
        });

        return new Response(message, { status: 200 })
    }
}

export default WebSocketController;
