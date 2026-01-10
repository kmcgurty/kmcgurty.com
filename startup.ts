import process from 'node:process';

const LIBRETRANSLATEPATH = Deno.env.get("LIBRETRANSLATEPATH");
const LIBRETRANSLATEPORT = Deno.env.get("LIBRETRANSLATEPORT") ?? "9999";

if (!LIBRETRANSLATEPATH) {
    console.error("env LIBRETRANSLATEPATH is not defined.");
    process.exit(0)
}

console.log("Spawning LibreTranslate on port ", LIBRETRANSLATEPORT);

new Deno.Command(LIBRETRANSLATEPATH, {
    args: [
        "--port",
        LIBRETRANSLATEPORT,
    ],
    stdin: "piped",
    stdout: "piped",
}).spawn();