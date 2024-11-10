import Helpers from "../Helpers/Helpers.ts"
import type Lobby from "../model/Lobby.ts"
import WebSocketModel from "../model/WebSocket.ts"

class WebSocketController {
    lobby: Lobby
    web_socket: WebSocketModel

    constructor(lobby: Lobby) {
        this.lobby = lobby
        this.web_socket = new WebSocketModel()
    }

    assignWebSocket(request: Request): Response {
        if (request.headers.get("upgrade") != "websocket") {
            throw new Error("no upgrade header")
        }

        if (request.headers.get("connection") != "Upgrade") {
            throw new Error("no connection header")
        }

        if (request.headers.get("sec-websocket-key") == "") {
            throw new Error("no websocket key")
        }
        const params = new URL(request.url).searchParams
        const id = params.get("id")
        if (!id) {
            return new Response("Player Id is required", { status: 400 })
        }

        try {
            return this.web_socket.handleWebSocket(request, id)
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            return new Response(errorMessage, { status: 400 })
        }
    }

    async broadcast(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { message?: string } = await Helpers.ReadableStreamToJsonObject(
            request.body
        )
        const message = body.message

        if (!message) {
            return new Response("Message is required", { status: 400 })
        }

        this.web_socket.broadcast(message)

        return new Response("Message sent", { status: 200 })
    }
}

export default WebSocketController;
