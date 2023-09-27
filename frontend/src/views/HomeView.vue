<script setup>
import Navbar from '../components/Navbar.vue'
import ScrapedResults from '../components/ScrapedResults.vue'

import { ref } from 'vue'
import axios from 'axios'

const messageFromChild = ref('')
const scrapingData = ref(null)
const loading = ref(false)

const handleChildMessage = (message) => {
	loading.value = true;

    messageFromChild.value = message

    const requestBody = {
        url: message.pageUrl,
        options: {
            test_mode: false,
            scrape_elements: 'h1, h2, h4, h5, a, span, div, sup, img',
            extract_sentiment: true
        }
    }

    axios
        .post('http://localhost:3000/api/scrape/page', requestBody)
        .then((response) => {
            if (requestBody?.options?.test_mode) {
                setTimeout(() => {
                    scrapingData.value = response?.data?.result?.content
					loading.value = false;
                }, 1000)
            } else {
				scrapingData.value = response?.data?.result?.content
				loading.value = false;
			}
        })
        .catch((error) => {
            console.error('Error:', error)
			loading.value = false;
        })
}
</script>

<template>
    <main class="wrapper">
        <Navbar @startScraping="handleChildMessage" :loading="loading" />
        <ScrapedResults :scrapingData="scrapingData" />
    </main>
</template>

<style scoped>
.wrapper {
    width: 100%;
    padding: 40px 80px;
}
</style>
