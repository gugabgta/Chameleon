import { assertEquals } from "jsr:@std/assert"
import Router from "../src/routing/Router.ts"
import HTTPMethod from "../src/types/HttpMethod.ts"
import MockModel from "./model/MockModel.ts"

if (import.meta.main) {
    Deno.exit(1)
}

const ac = new AbortController()

const server_config = {
    port: 3003,
    hostname: "localhost",
    signal: ac.signal,
}

const router = new Router()

router.registerRoute(HTTPMethod.GET, "/", () => {
    return new Response("Hello, world!")
})

router.registerRoute(HTTPMethod.GET, "/mockModel", MockModel.a_method)
router.registerRoute(HTTPMethod.POST, "/mockModel", MockModel.another_method)
router.routeGroup("/test", HTTPMethod.GET, [
    ["/get", () => new Response("working")],
])
router.routeGroup("/test", HTTPMethod.POST, [
    ["/post", MockModel.yet_another_method],
    ["/postJson", () => new Response(JSON.stringify({ key: "value" }))],
])

const fn = router.handle.bind(router)

const _server = Deno.serve(
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

Deno.test("router post Json", async () => {
    const response = await fetch("http://localhost:3003/test/postJson", {
        method: "POST",
    })
    const json = await response.json()
    assertEquals(json, { key: "value" })
})

Deno.test("router group get", async () => {
    const response = await fetch("http://localhost:3003/test/get")
    const text = await response.text()
    assertEquals(text, "working")
})

Deno.test("router group post", async () => {
    const response = await fetch("http://localhost:3003/test/post", {
        method: "POST",
        body: JSON.stringify({ test: "working" }),
    })
    const text = await response.text()
    assertEquals(text, "working")
})
