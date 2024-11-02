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
}

export default Helpers
