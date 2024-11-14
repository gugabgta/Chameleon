import Helpers from "../Helpers/Helpers.ts"
import Player, { type PlayerId } from "./Player.ts"

class Lobby {
    players: Map<PlayerId, Player> = new Map()
    settings: LobbySettings
    host: Player | null = null

    constructor(settings: LobbySettings) {
        this.settings = settings
    }

    index(): string {
        let players_string = ""
        this.players.forEach((player) => {
            players_string += `${player.name} - ${player.role} - ${player.location}\n`
        })

        return players_string
    }

    findPlayer(id: string): Player | undefined {
        return this.players.get(id)
    }

    getPlayers(): Array<Player> {
        return Array.from(this.players.values())
    }

    join(player: Player): boolean {
        this.players.set(player.id, player)
        return this.players.has(player.id)
    }

    startGame(host: Player, location: string): [boolean, string] {
        if (this.players.size < 4) {
            return [false, "Not enough players"]
        }
        if (this.players.size <= this.settings.impostors) {
            return [false, "Too many impostors"]
        }

        this.resetRoles()
        this.host = host
        this.players = Helpers.shuffleMap(this.players)
        let total_impostors = 0

        this.players.forEach((player) => {
            if (player == host) {
                player.setRole("host")
                player.setLocation(location)
                return
            }

            if (total_impostors < this.settings.impostors) {
                player.setRole("impostor")
                player.setLocation("??????")
                total_impostors++
                return
            }

            player.setRole("crewmate")
            player.setLocation(location)
        })

        return [true, "players roles set"]
    }

    leave(player: Player): boolean {
        if (this.host == player) {
            this.host = null
        }
        this.players.delete(player.id)
        return !this.players.has(player.id)
    }

    kill(): boolean {
        this.players.clear()
        this.host = null
        return true
    }

    resetRoles(): void {
        this.players.forEach((player) => {
            player.setRole("crewmate")
            player.setLocation("")
        })
    }
}

export type LobbySettings = {
    name: string
    impostors: number
    id: string
}

export default Lobby
