class Player {
    name: string
    role: PlayerRole = "crewmate"
    location: string = ""

    constructor(name: string) {
        this.name = name
    }

    setRole(role: PlayerRole) {
        this.role = role
    }

    setLocation(location: string) {
        this.location = location
    }
}

export type PlayerRole = "crewmate" | "impostor"

export default Player
