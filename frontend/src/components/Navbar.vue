<script>
export default {
	props: {
		loading: Boolean 
	},
	data() {
		return {
			inputValue: 'https://wsa-test.vercel.app/',
		}
	},
	methods: {
		async getValue() {
			if (this.loading) return
			try {
				await this.startScrapingPage(this.inputValue)
			} finally {
			}
		},
		async startScrapingPage(pageUrl) {
			this.$emit('startScraping', { pageUrl: pageUrl })

		}
	}
}
</script>

<template>
	<div class="container-wrapper">
		<input v-model="inputValue" type="text" placeholder="Enter a website url -> (https://google.com)" class="input" />
		<div @click="getValue" class="filled-btn">
			<template v-if="!loading"> Scrape </template>
			<template v-else>
				<div class="d-flex">
					<div class="spinner"></div>
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped>
.spinner {
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-top: 4px solid #888;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	animation: spin 1s linear infinite;
	display: inline-block;
	margin-left: 10px;
	margin-right: 10px;
	vertical-align: middle;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

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
