import process from 'node:process';

const mode = Deno.args[0]?.toLowerCase() as 'dev' | 'prod';
if (!mode || !['dev', 'prod'].includes(mode)) {
	console.error(
		"Error: You must specify either 'dev' or 'prod' as an argument"
	);
	console.error('Usage: deno run script.ts [dev|prod]');
	Deno.exit(1);
}

const LIBRETRANSLATEPATH = Deno.env.get('LIBRETRANSLATEPATH');
const LIBRETRANSLATEPORT = Deno.env.get('LIBRETRANSLATEPORT') ?? '9999';
const SVELTEPORT = Deno.env.get('SVELTEPORT') ?? '8080';

if (!LIBRETRANSLATEPATH) {
	console.error('env LIBRETRANSLATEPATH is not defined.');
	process.exit(0);
}

console.log('Spawning LibreTranslate on port ', LIBRETRANSLATEPORT);

const libreTranslate = new Deno.Command(LIBRETRANSLATEPATH, {
	args: ['--port', LIBRETRANSLATEPORT]
}).spawn();

await new Deno.Command('deno', {
	args: ['install']
}).spawn().status;

if (mode === 'dev') {
	await new Deno.Command('deno', {
		args: ['x', '-A', 'npm:vite', 'dev']
	}).spawn().status;
} else if (mode === 'prod') {
	await new Deno.Command('deno', {
		args: ['x', '-A', 'npm:vite', 'build']
	}).spawn().status;

	Deno.env.set('PORT', SVELTEPORT);
	await new Deno.Command('deno', {
		args: ['--allow-env', '--allow-read', '--allow-net', './build/index.js']
	}).spawn().status;
}

libreTranslate.kill();
