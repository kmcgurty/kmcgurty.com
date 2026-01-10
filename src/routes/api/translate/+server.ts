import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const response = await fetch("http://localhost:9999/translate", {
        method: "POST",
        body: await request.formData()
    });

    const responseData = await response.text();
    return new Response(responseData, {
        status: response.status,
        headers: response.headers
    });
}