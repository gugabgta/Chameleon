import Uuid from "../Helpers/Uuid.ts"

class Player {
    name: string
    role: PlayerRole = "crewmate"
    location: string = ""
    id: string = ""

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
