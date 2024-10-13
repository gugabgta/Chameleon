import Handler from "./src/controller/Handler.ts";
import HTTPMethod from "./src/types/HttpMethod.ts";

if (!import.meta.main) {
    Deno.exit(1)
}

const address = Deno.env.get("SERVER_ADDRESS")
const server_config = {
    port: 3000,
    hostname: address,
}

const handler = new Handler();

handler.registerRoute(HTTPMethod.GET, '/', () => {
    return new Response("Hello, world!")
});

const fn = handler.handle.bind(handler);

Deno.serve(
    server_config,
    fn
);
