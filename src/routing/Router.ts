import HTTPMethod from "../types/HttpMethod.ts"
import type Middleware from "./Middleware.ts"

type RouteCallback = (params: Request) => Response | Promise<Response>

type Route = {
    main_route: RouteCallback
    middlewares: Array<Middleware> | Middleware
    method: HTTPMethod
}

class Router {
    registeredRoutes: Map<string, Route> = new Map()

    async handle(request: Request): Promise<Response> {
        const url = new URL(request.url)
        return await this.route(request.method as HTTPMethod, url, request)
    }

    async route(method: HTTPMethod, url: URL, params: Request): Promise<Response> {
        const route_handler = this.registeredRoutes.get(`${url.pathname}:${method}`)
        if (!route_handler || route_handler.method !== method) {
            return new Response(`Not found ${url.pathname}`, { status: 404 })
        }

        if (!Array.isArray(route_handler.middlewares)) {
            route_handler.middlewares = [route_handler.middlewares]
        }

        for (const middleware of route_handler.middlewares) {
            const response = await middleware.handle(params)
            if (!response.ok) {
                return response
            }
        }
        return await route_handler.main_route(params)
    }

    registerRoute(
        method: HTTPMethod,
        route: string,
        callback: RouteCallback,
        middlewares: Array<Middleware> | Middleware = [],
    ): void {
        this.registeredRoutes.set(`${route}:${method}`, {
            main_route: callback,
            middlewares: middlewares,
            method: method,
        })
    }

    routeGroup(
        prefix: string,
        method: HTTPMethod,
        callback: Array<[string, RouteCallback]>,
        middlewares: Array<Middleware> | Middleware = [],
    ) {
        callback.forEach((route_info) => {
            const [route, callback] = route_info
            this.registerRoute(method, `${prefix}${route}`, callback, middlewares)
        })
    }
}

export default Router
