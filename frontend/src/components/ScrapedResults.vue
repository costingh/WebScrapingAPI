<script setup>
import PageData from './PageData.vue'

const { elements, scrapingData } = defineProps(['elements', 'scrapingData']);

</script>

<template>
  <div>
    <PageData v-for="(data, index) in scrapingData" :key="index" :scrapingData="data">
    </PageData>
  </div>
</template>
