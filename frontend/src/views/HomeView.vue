<script setup>
import Navbar from '../components/Navbar.vue';
import ScrapedResults from '../components/ScrapedResults.vue';

import { ref } from 'vue';
import axios from 'axios';

const messageFromChild = ref('');
const scrapingData = ref(null);

const handleChildMessage = (message) => {
	messageFromChild.value = message;

	const requestBody = {
		url: message.pageUrl,
		options: {
			test_mode: true,
			scrape_elements: "h1, h2, h4, h5, a, span, div, sup, img",
			extract_sentiment: true
		}
	};

	axios
		.post('http://localhost:3000/api/scrape/page', requestBody)
		.then((response) => {
			console.log('Response:', response?.data?.result?.content)
			scrapingData.value = response?.data?.result?.content;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};
</script>

<template>
	<main class="wrapper">
		<Navbar @startScraping="handleChildMessage" />
		<ScrapedResults :scrapingData="scrapingData" />
	</main>
</template>

<style scoped>
.wrapper {
	width: 100%;
	padding: 40px 80px;
}

</style>