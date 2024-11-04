import Helpers from "../Helpers.ts"
import Player from "./Player.ts"

class Lobby {
    players: Player[] = []
    settings: LobbySettings
    host: Player | null = null

    constructor(settings: LobbySettings) {
        this.settings = settings
    }

    index(): Response {
        return new Response(
            this.players.map((player) => `${player.name} - ${player.role} - ${player.location}`)
                .join(",\n"),
        )
    }

    getPlayers(): Response {
        if (this.players.length === 0) {
            return new Response("No players", { status: 404 })
        }
        return new Response(JSON.stringify({ players: this.players }), {
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

        this.players.push(new Player(name))
        return new Response("Player added", { status: 201 })
    }

    async startGame(request: Request): Promise<Response> {
        if (!request.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { location?: string; host?: string } = await Helpers.ReadableStreamToJsonObject(
            request.body,
        )
        const location = body.location
        const host = body.host

        if (!location) {
            return new Response("where are we?", { status: 400 })
        }
        if (!host) {
            return new Response("who is the host?", { status: 400 })
        }

        this.host = new Player(host)
        this.players = this.players.filter((player) => player.name !== host)

        if (this.players.length < 3) {
            return new Response("Not enough players", { status: 400 })
        }
        if (this.players.length <= this.settings.impostors) {
            return new Response("Too many impostors", { status: 400 })
        }

        this.players.forEach((player) => player.setRole("crewmate"))
        this.players = Helpers.shuffleArray(this.players)
        this.players.slice(0, this.settings.impostors).forEach((player) => {
            player.setRole("impostor")
            player.setLocation("impostor")
        })

        this.players.forEach((player) => {
            if (player.role === "crewmate") {
                player.setLocation(location)
            }
        })

        return new Response("players roles set")
    }

    returnRole(request: Request): Response {
        const params = new URL(request.url).searchParams
        const name = params.get("name")
        if (!name) {
            return new Response("Name is required", { status: 400 })
        }
        const player = this.players.find((player) => player.name === name)
        if (!player) {
            return new Response("Player not found", { status: 404 })
        }
        return new Response(player.role)
    }

    getLocation(request: Request): Response {
        const params = new URL(request.url).searchParams
        const name = params.get("name")
        if (!name) {
            return new Response("Name is required", { status: 400 })
        }
        const player = this.players.find((player) => player.name === name)
        if (!player) {
            return new Response("Player not found", { status: 404 })
        }
        return new Response(JSON.stringify({location: player.location}))
    }
}

export type LobbySettings = {
    name: string
    impostors: number
}

export default Lobby
