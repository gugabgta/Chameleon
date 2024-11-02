class Html {
    web_component: string
    html_template: string = "svelte/src/app.html"

    constructor(web_component: string) {
        this.web_component = web_component
    }

    getHtml(): string {
        const html = Deno.readTextFileSync(this.html_template)
        return html.replace(
            "<placeholdercomponent>",
            `<${this.web_component}></${this.web_component}>`,
        )
    }

    htmlResponse(): Response {
        return new Response(this.getHtml(), {
            headers: {
                "content-type": "text/html",
            },
        })
    }
}

export default Html
