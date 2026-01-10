import process from 'node:process';

const LIBRETRANSLATEPATH = Deno.env.get("LIBRETRANSLATEPATH");
const LIBRETRANSLATEPORT = Deno.env.get("LIBRETRANSLATEPORT") ?? "9999";

if (!LIBRETRANSLATEPATH) {
    console.error("env LIBRETRANSLATEPATH is not defined.");
    process.exit(0)
}

const port = LIBRETRANSLATEPORT || "99999";
console.log("Spawning LibreTranslate on port ", port);

new Deno.Command(LIBRETRANSLATEPATH, {
    args: [
        "--port",
        port,
    ],
    stdin: "piped",
    stdout: "piped",
}).spawn();