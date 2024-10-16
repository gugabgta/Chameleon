abstract class Model {
    abstract index(): Response
    separateURLSearchParams(params: URLSearchParams): Map<string, string> {
        const map = new Map<string, string>()
        for (const [key, value] of params) {
            map.set(key, value)
        }
        return map
    }
}

export default Model
