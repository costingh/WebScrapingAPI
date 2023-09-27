<script setup>
import Navbar from '../components/Navbar.vue';
import ScrapedResults from '../components/ScrapedResults.vue';

import { ref } from 'vue';
import axios from 'axios';

const messageFromChild = ref('');

const handleChildMessage = (message) => {
	messageFromChild.value = message;

	const requestBody = {
		url: message.pageUrl,
		options: {
			test_mode: false,
			scrape_elements: "h1, h2, h4, h5, a, span, div, sup, img",
			extract_sentiment: true
		}
	};

	axios
		.post('http://localhost:3000/api/scrape/page', requestBody)
		.then((response) => {
			console.log('Response:', response.data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};
</script>

<template>
	<main>
		<Navbar @startScraping="handleChildMessage" />
		<ScrapedResults />
	</main>
</template>
