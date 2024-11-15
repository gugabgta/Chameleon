abstract class Middleware {
    abstract handle(req: Request): Response | Promise<Response>
}

export default Middleware
