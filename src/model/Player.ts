import Uuid from "../helpers/Uuid.ts"

export type PlayerId = string

class Player {
    name: string
    role: PlayerRole = "crewmate"
    location: string = ""
    id: PlayerId = ""

    constructor(name: string) {
        this.name = name
        this.id = Uuid.generate()
    }

    setRole(role: PlayerRole) {
        this.role = role
    }

    setLocation(location: string) {
        this.location = location
    }
}

export type PlayerRole = "crewmate" | "impostor" | "host"

export default Player
