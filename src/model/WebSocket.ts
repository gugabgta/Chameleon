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

    broadcast(message: string): void {
        this.socket_connections.forEach((socket) => {
            socket.send(message)
        })
    }

    broadcastTo(socket_id: PlayerId, message: string): boolean {
        const socket = this.socket_connections.get(socket_id)
        if (!socket) {
            return false
        }
        socket.send(message)
        return true
    }
}

export default WebSocketModel;
