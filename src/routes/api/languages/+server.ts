import { LIBRETRANSLATE_API_URL } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const response = await fetch(LIBRETRANSLATE_API_URL + '/languages');
	return new Response(await response.text(), {
		status: response.status,
		headers: response.headers
	});
};
