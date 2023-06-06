<script lang="ts">
	import { onMount } from "svelte";

	let id = "___";
	let content: string | undefined = undefined;
	let saving = false;
	let loading = true;

	const get = async () => {
		loading = true;

		const res = await fetch(`/api/?id=${id}`);
		const data = await res.json();

		if (data?.content) {
			content = data.content;
		} else if (id !== "___") {
			id = "___";
		}

		loading = false;
	};

	const save = async () => {
		saving = true;

		const res = await fetch(`/api`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content }),
		});

		const data = await res.json();
		id = data.id;
		window.location.hash = id;

		saving = false;
	};

	let location: any = {};

	onMount(() => {
		id = window.location.hash ? window.location.hash.slice(1) : "___";

		if (id !== "___") {
			get();
		}

		location = window.location;
	});

	const debounce = (callback: any, wait: number) => {
		let timeoutId: number = 0;

		return (...args: any) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				callback.apply(null, args);
			}, wait);
		};
	};

	$: document.title = `${id} - ${location.host || ""}`;
	$: if (id === "___") content = undefined;
	$: id = window.location.hash ? window.location.hash.slice(1) : "___";
</script>

<div class="p-4">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<h1 class="flex items-center h-6 text-gray-400">
		{location.host || ""}/<span class="text-white">{id}</span>

		{#if saving}
			<span class="ml-4 loading loading-spinner loading-sm" />
		{/if}
	</h1>
</div>

{#if loading}
	<div class="w-screen h-[calc(100vh-70px)] flex justify-center items-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else}
	<textarea
		placeholder="Enter some data. URL will update automatically"
		bind:value={content}
		on:input={debounce(() => save(), 1000)}
		class="overflow-auto border border-gray-700 resize-none rounded outline-0 text-sm bg-transparent p-4 w-screen h-[calc(100vh-70px)]"
	/>
{/if}
