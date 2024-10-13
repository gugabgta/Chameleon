import HTTPMethod from "../types/HttpMethod.ts";

type RouteCallback = (params: Request) => Response

class Handler {
    registeredRoutesGet: Map<string, RouteCallback> = new Map()
    registeredRoutesPost: Map<string, RouteCallback> = new Map()

    handle(request: Request): Response {
        const url = new URL(request.url)
        return this.route(request.method as HTTPMethod, url, request)
    }

    route(method: HTTPMethod, url: URL, params: Request): Response {
        const pool = this.pickPool(method)
        const routeHandler = pool.get(url.pathname);
        if (routeHandler) {
            return routeHandler(params);
        }

        return new Response(`Not found ${method}, ${url.pathname}`, { status: 404 })
    }

    registerRoute(method: HTTPMethod,route: string, callback: RouteCallback) {
        switch (method) {
            case HTTPMethod.GET:
                this.registeredRoutesGet.set(route, callback)
                break;
            case HTTPMethod.POST:
                this.registeredRoutesPost.set(route, callback)
                break;
        }
    }

    pickPool(method: HTTPMethod): Map<string, RouteCallback> {
        switch (method) {
            case HTTPMethod.GET:
                return this.registeredRoutesGet
            case HTTPMethod.POST:
                return this.registeredRoutesPost
        }
    }
}

export default Handler
