<script lang="ts">
	type Language = {
		code: string;
		name: string;
	};

	let input = $state('');
	let translatePath: string[] = $state([]);
	let MaxTranslate = 6;

	let translatePromise: Promise<string> | undefined = $state(undefined);
	let languagesPromise = getLanguages();

	async function getLanguages() {
		const response = await fetch('/api/languages');
		return (await response.json()) as Language[];
	}

	async function translate(data: {
		q: string;
		source: string;
		target: string;
	}) {
		const response = await fetch('/api/translate', {
			method: 'POST',
			body: JSON.stringify(data)
		});

		if (!response.ok) throw response.json();

		return (await response.json()) as {
			translatedText: string;
		};
	}

	async function formSubmit(e: SubmitEvent): Promise<string> {
		translatePath = [];

		e.preventDefault();
		const target = e.currentTarget as HTMLFormElement;
		const formData = new FormData(target);
		const initialQuery = formData.get('query') as string;
		const source = formData.get('source') as string;
		const languages = await languagesPromise;

		let currentTranslation = {
			q: initialQuery,
			source: source
		};

		for (let i = 0; i <= MaxTranslate; i++) {
			const randLanguageIndex = Math.floor(Math.random() * languages.length);
			const targetLanguage = languages[randLanguageIndex];
			translatePath.push(targetLanguage.name);

			const response = await translate({
				q: currentTranslation.q,
				source: currentTranslation.source,
				target: targetLanguage.code
			});

			currentTranslation = {
				q: response.translatedText,
				source: targetLanguage.code
			};
		}

		translatePath.push('English');
		const finalResponse = await translate({
			q: currentTranslation.q,
			source: currentTranslation.source,
			target: 'en'
		});

		return finalResponse.translatedText;
	}
</script>

<div class="m-10 flex flex-col items-center">
	<div class="text-2xl font-bold md:text-3xl lg:text-4xl">
		Lost In Translation
	</div>
	<div class="my-4 max-w-72 text-xs sm:text-sm">
		Enter a sentence to be randomly translated {MaxTranslate} times, the final being
		English. Try submitting the the same input multiple times. It will be different
		every time!
	</div>
	<form
		class="flex flex-col items-center gap-2"
		onsubmit={(e) => (translatePromise = formSubmit(e))}
	>
		<textarea
			bind:value={input}
			onkeypress={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					e.currentTarget.closest('form')?.requestSubmit();
				}
			}}
			class="textarea w-96"
			cols="20"
			name="query"
			placeholder="Text to translate"
			required
		></textarea>
		{#await languagesPromise}
			<select class="select" required disabled>
				<option selected>Loading languages...</option>
			</select>
		{:then languages}
			<select class="select" name="source" required>
				{#each languages as language}
					<option value={language.code}>{language.name}</option>
				{/each}
			</select>
		{/await}
		<button class="btn" type="submit">Submit</button>
	</form>

	{#if translatePromise}
		<div class="divider"></div>

		{#await translatePromise}
			<span class="loading loading-sm"></span>
			<progress
				class="progress w-56"
				value={translatePath.length}
				max={MaxTranslate + 1}
			>
			</progress>
		{:then result}
			<div class="flex w-xl flex-row text-center">
				<div class="grow basis-0">{translatePath.join(' > ')}</div>
				<div class="divider divider-horizontal"></div>
				<div class="grow basis-0">{result}</div>
			</div>
		{:catch e}
			There was a problem during translation:
			<pre>{e}</pre>
		{/await}
	{/if}
</div>
