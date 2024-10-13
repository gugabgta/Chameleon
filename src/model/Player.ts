import Model from "./Model.ts"

class Player extends Model {
    name: string

    constructor(name: string) {
        super()
        this.name = name
    }

    index(): Response {
        return new Response("Player: " + this.name)
    }
}

export default Player
