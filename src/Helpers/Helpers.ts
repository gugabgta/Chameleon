class Helpers {
    static shuffleArray<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5)
    }

    static ReadableStreamToJsonObject(stream: ReadableStream): Promise<object> {
        const reader = stream.getReader()
        return new Promise((resolve, _) => {
            const decoder = new TextDecoder()
            let result = ""
            reader.read().then(function processText({ done, value }) {
                if (done) {
                    resolve(JSON.parse(result))
                    return
                }
                result += decoder.decode(value || new Uint8Array(), { stream: true })
                reader.read().then(processText)
            })
        })
    }

    static shuffleMap<K, V>(map: Map<K, V>): Map<K, V> {
        const keys = Array.from(map.keys())
        const shuffled_keys = Helpers.shuffleArray(keys)
        const shuffled_map = new Map<K, V>()
        shuffled_keys.forEach((key) => {
            const value = map.get(key)
            if (value !== undefined) {
                shuffled_map.set(key, value)
            }
        })
        return shuffled_map
    }
}

export default Helpers
