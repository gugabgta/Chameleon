import Helpers from "../../src/Helpers.ts"

class MockModel {
    name: string

    constructor(name: string) {
        this.name = name
    }

    index(): Response {
        return new Response(this.name)
    }

    static a_method(_params: Request): Response {
        return new Response("a_method")
    }

    static another_method(_params: Request): Response {
        return new Response("another_method")
    }

    static async yet_another_method(_params: Request): Promise<Response> {
        if (!_params.body) {
            return new Response("Invalid request body", { status: 400 })
        }
        const body: { test?: string } = await Helpers.ReadableStreamToJsonObject(_params.body)
        const value = body.test

        return new Response(value)
    }
}

export default MockModel
