import Middleware from "./Middleware.ts"

class Auth extends Middleware {
    handle(request: Request): Response {
        const headers = request.headers
        const auth = headers.get("Authorization")
        if (!auth) {
            return new Response("Unauthorized", { status: 401 })
        }
        return new Response("Authorized")
    }
}

export default Auth
