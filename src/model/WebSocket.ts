import type BroadcastMessage from "./BroadcastMessage.ts"
import type { PlayerId } from "./Player.ts"

class WebSocketModel {
    socket_connections: Map<PlayerId, WebSocket> = new Map()

    handleWebSocket(request: Request, id: PlayerId): Response {
        const { socket, response } = Deno.upgradeWebSocket(request)

        if (response.status !== 101) {
            throw new Error("upgrade failed")
        }

        this.socket_connections.set(id, socket)
        return response
    }

    broadcast(message: BroadcastMessage): void {
        this.socket_connections.forEach((socket) => {
            socket.send(message.getMessage())
        })
    }

    broadcastTo(socket_id: PlayerId, message: BroadcastMessage): boolean {
        const socket = this.socket_connections.get(socket_id)
        if (!socket) {
            return false
        }
        socket.send(message.getMessage())
        return true
    }

    addListener(
        event: SocketEvent,
        listener: (this: WebSocket, ev: MessageEvent<unknown> | CloseEvent | Event) => unknown,
    ): void {
        this.socket_connections.forEach((socket) => {
            socket.addEventListener(event, listener)
        })
    }
}

export default WebSocketModel
type SocketEvent = "message" | "close" | "error" | "open"
