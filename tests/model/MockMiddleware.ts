import Middleware from "../../src/routing/Middleware.ts"

class MockMiddleware extends Middleware {
    public handle(request: Request): Response {
        if (request.headers.get("Test") !== "true") {
            return new Response("Not authorized", { status: 401 })
        }
        return new Response("MockMiddleware")
    }
}

export default MockMiddleware
