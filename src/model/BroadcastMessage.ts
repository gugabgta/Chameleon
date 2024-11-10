class BroadcastMessage {
    message: string
    channel: string
    separator: string = ":"
    constructor(message: string = "", channel: string = "") {
        this.message = message
        this.channel = channel
    }

    setMessage(message: string): BroadcastMessage {
        this.message = message
        return this
    }

    setChannel(channel: string): BroadcastMessage {
        this.channel = channel
        return this
    }

    getMessage(): string {
        return `${this.channel}${this.separator}${this.message}`
    }
}

export default BroadcastMessage
