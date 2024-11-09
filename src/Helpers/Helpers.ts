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
        const values = Array.from(map.values())
        const shuffled_keys = Helpers.shuffleArray(keys)
        const shuffled_values = Helpers.shuffleArray(values)
        const shuffled_map = new Map<K, V>()
        shuffled_keys.forEach((key, index) => {
            shuffled_map.set(key, shuffled_values[index])
        })
        return shuffled_map
    }
}

export default Helpers
