import { assertEquals } from "jsr:@std/assert"
import Lobby from "../src/model/Lobby.ts"
import Player from "../src/model/Player.ts"
import Uuid from "../src/helpers/Uuid.ts"

if (import.meta.main) {
    Deno.exit(1)
}

const settings = {
    name: "test_lobby",
    impostors: 2,
    id: Uuid.generate(),
}

const lobby = new Lobby(settings)

function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

const players: Array<Player> = [
    new Player(randomString(5)),
    new Player(randomString(6)),
    new Player(randomString(7)),
    new Player(randomString(8)),
    new Player(randomString(9)),
    new Player(randomString(10)),
]

Deno.test("Player joining a lobby", () => {
    assertEquals(lobby.join(players[0]), true)
    assertEquals(lobby.join(players[1]), true)
})

Deno.test("Get players from lobby", () => {
    assertEquals(lobby.getPlayers().length, 2)
})

Deno.test("Start game with too few players", () => {
    const [success, _message] = lobby.startGame(players[0], "test_location")
    assertEquals(success, false)
})

Deno.test("Add more players to lobby", () => {
    assertEquals(lobby.join(players[2]), true)
    assertEquals(lobby.join(players[3]), true)
    assertEquals(lobby.join(players[4]), true)
    assertEquals(lobby.join(players[5]), true)
})

Deno.test("All players in", () => {
    assertEquals(lobby.getPlayers().length, players.length)
})

Deno.test("Start game", () => {
    const [success, _message] = lobby.startGame(players[0], "test_location")
    assertEquals(success, true)
    assertEquals(lobby.getPlayers().length, players.length)
})

Deno.test("All players have a role", () => {
    const impostors = lobby.getPlayers().filter((player) => player.role === "impostor")
    assertEquals(impostors.length, settings.impostors)

    const crewmates = lobby.getPlayers().filter((player) => player.role === "crewmate")
    assertEquals(crewmates.length, players.length - settings.impostors - 1)

    const host = lobby.getPlayers().find((player) => player.role === "host")
    assertEquals(host, players[0])
})

Deno.test("KILL THEM ALL", () => {
    assertEquals(lobby.kill(), true)
    assertEquals(lobby.getPlayers().length, 0)
    assertEquals(lobby.host, null)
})
