import Model from "../../src/model/Model.ts"

class MockModel extends Model {
    name: string

    constructor(name: string) {
        super()
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

    static yet_another_method(_params: Request): Response {
        return new Response("yet_another_method")
    }
}

export default MockModel
