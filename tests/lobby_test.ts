import { assertEquals } from "jsr:@std/assert"
import Lobby from "../src/model/Lobby.ts"
import Player from "../src/model/Player.ts"

if (import.meta.main) {
    Deno.exit(1)
}

const lobby = new Lobby({
    name: "test_lobby",
    impostors: 2,
})

function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

const players: Array<Player> = [
    new Player(randomString(6)),
    new Player(randomString(6)),
    new Player(randomString(6)),
    new Player(randomString(6)),
    new Player(randomString(6)),
    new Player(randomString(6)),
]

const join_requests: Array<Request> = [
    new Request(`http://localhost:1234?name=${players[0].name}`),
    new Request(`http://localhost:1234?name=${players[1].name}`),
    new Request(`http://localhost:1234?name=${players[2].name}`),
    new Request(`http://localhost:1234?name=${players[3].name}`),
    new Request(`http://localhost:1234?name=${players[4].name}`),
    new Request(`http://localhost:1234?name=${players[5].name}`),
]

const start_game_request: Request = new Request(
    `http://localhost:1234?location=beach?host=${players[0].name}`,
)

const location_assignment_requests = [
    new Request(`http://localhost:1234?name=${players[1].name}`),
    new Request(`http://localhost:1234?name=${players[5].name}`),
    new Request(`http://localhost:1234?name=${players[3].name}`),
    new Request(`http://localhost:1234?name=${players[0].name}`),
    new Request(`http://localhost:1234?name=${players[4].name}`),
    new Request(`http://localhost:1234?name=${players[2].name}`),
]

Deno.test("Player joining a lobby", () => {
    join_requests.forEach((request) => {
        const response = lobby.join(request)
        assertEquals(response.status, 200)
    })
    assertEquals(lobby.players.length, 6)

    const response = lobby.startGame(start_game_request)
    assertEquals(response.status, 200)

    const impostors = lobby.players.filter((player) =>
        player.role === "impostor"
    )
    const crewmates = lobby.players.filter((player) =>
        player.role === "crewmate"
    )
    assertEquals(impostors.length, 2)
    assertEquals(crewmates.length, 4)
})
