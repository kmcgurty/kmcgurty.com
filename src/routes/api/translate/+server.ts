import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    const response = await fetch("http://localhost:9999/translate", {
        method: "POST",
        body: formData
    });

    return new Response(await response.text(), {
        status: response.status,
        headers: response.headers
    });
}