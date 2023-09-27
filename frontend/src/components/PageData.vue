<template>
	<div class="container-wrapper ">
		<div class="d-flex">
			<p class="title">Page URL: {{ scrapingData.url }}</p>
			<div class="tabs">
				<div class="tab" v-for="tab in tabs" :key="tab" @click="selectTab(tab)"
					:class="{ active: selectedTab === tab }">
					{{ tab }}
				</div>
				<div class="clear" @click="selectTab('')">Clear</div>
			</div>
		</div>
		<div class="body" v-for="(data, index) in filteredData" :key="index">
			<template v-if="data.tag == 'a'">
				<div><span>Link label:</span> {{ data.text || 'Link has no visible text' }}</div>
				<div><span>Link address:</span> {{ data.href || 'Empty link' }}</div>
			</template>
			<template v-else-if="data.tag == 'img'">
				<div><span>Image address:</span> {{ data.src || 'Link has no visible text' }}</div>
				<div><span>Image alt text:</span> {{ data.alt || 'Empty alternative text' }}</div>
			</template>
			<template v-else>
				<div><span>Text for tag: </span> {{ data.text || 'Empty text for this tag' }}</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, computed, watch } from 'vue';

const tabs = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span', 'a', 'img'];
const { scrapingData } = defineProps(['scrapingData']);

const selectedTab = ref('');

const selectTab = (tab) => {
	selectedTab.value = tab;
};

const clearTabSelection = () => {
	selectedTab.value = null;
};

const filteredData = computed(() => {
	if (!selectedTab.value) {
		return [];
	}
	return scrapingData.data.filter((data) => data.tag === selectedTab.value);
});
</script>


<style scoped>
.active {
	background-color: #ccc;
	color: #eee;
}

.d-flex {
	align-items: center;
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.tabs {
	align-items: center;
	display: flex;
	justify-content: flex-end;
	column-gap: 20px;
}

.clear {
	background-color: darkred;
	color: #fff;
	padding: 4px 10px;
	border-radius: 10px;
	cursor: pointer;
}

.tab {
	background-color: #3a3a3a;
	color: #eee;
	padding: 4px 10px;
	border-radius: 10px;
	cursor: pointer;
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
	margin-top: 20px;
	display: block;
}

.title {
	font-size: 15px;
	font-weight: 15px;
	font-weight: 600;
	color: #111;
}

.body {
	width: 100%;
	padding: 20px 0px;
	display: block;
}

.body span {
	font-size: 12px;
	color: #888;
}

.body > div {
	font-size: 12px;
	color: #111;
}
</style>