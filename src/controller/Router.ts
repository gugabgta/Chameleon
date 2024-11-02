import HTTPMethod from "../types/HttpMethod.ts"

type RouteCallback = (params: Request) => Response | Promise<Response>

class Router {
    registeredRoutesGet: Map<string, RouteCallback> = new Map()
    registeredRoutesPost: Map<string, RouteCallback> = new Map()

    async handle(request: Request): Promise<Response> {
        const url = new URL(request.url)
        return await this.route(request.method as HTTPMethod, url, request)
    }

    async route(method: HTTPMethod, url: URL, params: Request): Promise<Response> {
        const pool = this.pickPool(method)
        const routeHandler = pool.get(url.pathname)
        if (routeHandler) {
            return await routeHandler(params)
        }

        return new Response(`Not found ${url.pathname}`, { status: 404 })
    }

    registerRoute(method: HTTPMethod, route: string, callback: RouteCallback): void {
        switch (method) {
            case HTTPMethod.GET:
                this.registeredRoutesGet.set(route, callback)
                break
            case HTTPMethod.POST:
                this.registeredRoutesPost.set(route, callback)
                break
        }
    }

    routeGroup(prefix: string, method: HTTPMethod, callback: Array<[string, RouteCallback]>) {
        callback.forEach((route_info) => {
            const [route, callback] = route_info
            this.registerRoute(method, `${prefix}${route}`, callback)
        })
    }

    private pickPool(method: HTTPMethod): Map<string, RouteCallback> {
        switch (method) {
            case HTTPMethod.GET:
                return this.registeredRoutesGet
            case HTTPMethod.POST:
                return this.registeredRoutesPost
            default:
                throw new Error(`Unsupported HTTP method: ${method}`)
        }
    }
}

export default Router
