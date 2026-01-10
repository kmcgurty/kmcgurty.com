<script lang="ts">
	let input = '';
	let translatePromise: Promise<Translation> | undefined = undefined;

	type LibreTranslateSuccess = {
		translatedText: string;
	};

	type Translation = {
		original: string;
		translated: string;
	};

	async function translate(e: SubmitEvent): Promise<Translation> {
		e.preventDefault();
		const target = e.currentTarget as HTMLFormElement;
		const formData = new FormData(target);
		formData.set('target', 'es');
		const response = await fetch('/api/translate', {
			method: 'POST',
			body: formData
		});
		if (!response.ok) throw response.json();
		const translation = (await response.json()) as LibreTranslateSuccess;
		return {
			original: formData.get('q')?.toString() ?? 'Undefined',
			translated: translation.translatedText
		};
	}
</script>

<div class="flex flex-col items-center">
	<form
		class="flex flex-col items-center gap-1"
		onsubmit={(e) => {
			input = '';
			translatePromise = translate(e);
		}}
	>
		<textarea
			bind:value={input}
			class="textarea"
			name="q"
			placeholder="Text to translate"
			required
		></textarea>
		<select class="select" name="source">
			<option selected value="en">English</option>
		</select>
		<button class="btn" type="submit">Submit</button>
	</form>

	{#if translatePromise}
		<div class="divider"></div>

		{#await translatePromise}
			<span class="loading loading-sm"></span>Translating...
		{:then result}
			<div class="flex w-xl flex-row text-center">
				<div class="grow basis-0">{result.original}</div>
				<div class="divider divider-horizontal"></div>
				<div class="grow basis-0">{result.translated}</div>
			</div>
		{:catch e}
			There was a problem during translation:
			<pre>{e}</pre>
		{/await}
	{/if}
</div>
