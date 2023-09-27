<script>
export default {
	data() {
		return {
			inputValue: 'http://localhost:3000/api/scrape/page'
		};
	},
	methods: {
		getValue() {
			this.startScrapingPage(this.inputValue);
		},
		startScrapingPage(pageUrl) {
			this.$emit('startScraping', { pageUrl: pageUrl });
		}
	}
};
</script>

<template>
	<div class="container-wrapper">
		<input v-model="inputValue" type="text" placeholder="Enter a website url -> (https://google.com)" class="input" />
		<div @click="getValue" class="filled-btn">Scrape</div>
	</div>
</template>

<style scoped>
.container-wrapper {
	width: 80%;
	margin: 0 auto;
	border: 1px solid #ccc;
	border-radius: 13px;
	padding: 10px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 30px;
}

.filled-btn {
	background-color: #111;
	color: #eee;
	border-radius: 13px;
	font-weight: 500;
	font-size: 14px;
	letter-spacing: 0.2px;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1px solid #111;
	display: inline-block;
	padding: 8px 16px;
}

.filled-btn:hover {
	background-color: transparent;
	color: #111;
}

.input {
	background-color: transparent;
	appearance: none;
	border: 1px solid #ccc;
	padding: 10px 20px;
	font-size: 14px;
	color: #111;
	border-radius: 13px;
	width: 500px;
	outline: none;
}

.input:focus {
	outline: 1px solid #111;
}
</style>
