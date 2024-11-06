import Helpers from "../Helpers/Helpers.ts"
import Player from "./Player.ts"

class Lobby {
    players: Player[] = []
    settings: LobbySettings
    host: Player | null = null

    constructor(settings: LobbySettings) {
        this.settings = settings
    }

    index(): string {
        return this.players.map(
            (player) => `${player.name} - ${player.role} - ${player.location}`,
        ).join(",\n")
    }

    findPlayer(id: string): Player | undefined {
        return this.players.find((player) => player.id === id)
    }

    getPlayers(): Array<Player> {
        return this.players
    }

    join(player: Player): boolean {
        return this.players.push(player) > 0
    }

    startGame(host: Player, location: string): [boolean, string] {
        if (this.players.length < 4) {
            return [false, "Not enough players"]
        }
        if (this.players.length <= this.settings.impostors) {
            return [false, "Too many impostors"]
        }

        this.resetRoles()
        this.host = host
        this.players = Helpers.shuffleArray(this.players)
        let total_impostors = 0

        this.players.forEach((player) => {
            if (player == host) {
                player.setRole("host")
                player.setLocation(location)
                return
            }

            if (total_impostors < this.settings.impostors) {
                player.setRole("impostor")
                total_impostors++
                return
            }

            player.setRole("crewmate")
            player.setLocation(location)
        })

        return [true, "players roles set"]
    }

    kill(): boolean {
        this.players = []
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
