import { assertEquals } from "jsr:@std/assert"
import Handler from "../src/controller/Handler.ts"
import MockModel from "./model/MockModel.ts"
import HTTPMethod from "../src/types/HttpMethod.ts"

if (import.meta.main) {
    Deno.exit(1)
}

const ac = new AbortController()

const server_config = {
    port: 3003,
    hostname: "localhost",
    signal: ac.signal,
}

const handler = new Handler()

handler.registerRoute(HTTPMethod.GET, "/", () => {
    return new Response("Hello, world!")
})

handler.registerRoute(HTTPMethod.GET, "/mockModel", MockModel.a_method)
handler.registerRoute(HTTPMethod.POST, "/mockModel", MockModel.another_method)

const fn = handler.handle.bind(handler)

const server = Deno.serve(
    server_config,
    fn,
)

Deno.test("router anonym function", async () => {
    const response = await fetch("http://localhost:3003/")
    const text = await response.text()
    assertEquals(text, "Hello, world!")
})

Deno.test("router get", async () => {
    const response = await fetch("http://localhost:3003/mockModel", {
        method: "GET",
    })
    const text = await response.text()
    assertEquals(text, "a_method")
})

Deno.test("router post", async () => {
    const response = await fetch("http://localhost:3003/mockModel", {
        method: "POST",
    })
    const text = await response.text()
    assertEquals(text, "another_method")
})

Deno.test({
    name: "abort controller",
    fn: () => {
        ac.abort()
    },
})
