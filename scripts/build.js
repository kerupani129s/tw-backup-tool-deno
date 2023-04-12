import * as esbuild from 'https://deno.land/x/esbuild@v0.17.15/wasm.js';

const minify = async (inputFilePath, outputFilePath) => {

	const code = await Deno.readTextFile(inputFilePath);

	const result = await esbuild.transform(code, { minify: true, format: 'iife', charset: 'utf8' });

	for (const warning of result.warnings) {
		console.warn(warning);
	}

	await Deno.writeTextFile(outputFilePath, result.code);

};

await minify('src/followers-or-following-bookmarklet.js', 'dist/followers-or-following-bookmarklet.min.js');

esbuild.stop();
