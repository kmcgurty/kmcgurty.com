import { LIBRETRANSLATE_API_URL } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const formData = new FormData();

	for (const key in data) {
		formData.append(key, data[key]);
	}

	const response = await fetch(LIBRETRANSLATE_API_URL + '/translate', {
		method: 'POST',
		body: formData
	});

	return new Response(await response.text(), {
		status: response.status,
		headers: response.headers
	});
};
