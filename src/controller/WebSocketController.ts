import type Lobby from "../model/Lobby.ts"

class WebSocketController {
    lobby: Lobby

    constructor(lobby: Lobby) {
        this.lobby = lobby
    }

    handleWebSocket(request: Request): Deno.WebSocketUpgrade {
        if (request.headers.get("upgrade") != "websocket") {
            throw new Error("no upgrade header")
        }

        if (request.headers.get("connection") != "Upgrade") {
            throw new Error("no connection header")
        }

        if (request.headers.get("sec-websocket-key") == "") {
            throw new Error("no websocket key")
        }
        return Deno.upgradeWebSocket(request)
    }

    static addListeners(connection: WebSocket): void {
        connection.addEventListener("message", (event) => {
            console.log(event)
        })

        connection.addEventListener("close", () => {
            console.log("WebSocket connection closed")
        })

        connection.addEventListener("error", (error) => {
            console.error(`WebSocket error:`, error)
        })

        connection.addEventListener("open", () => {
            console.log("WebSocket connection open")
        })
    }
}

export default WebSocketController;
