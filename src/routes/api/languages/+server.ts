import { type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    const response = await fetch("http://localhost:9999/languages");
    return new Response(await response.text(), {
        status: response.status,
        headers: response.headers
    });
}