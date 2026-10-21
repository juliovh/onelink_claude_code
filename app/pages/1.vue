<template>
  <div>
    <templates-simple v-if="decodedData" :acc="decodedData" />
    <div
      v-else
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm text-slate-500"
    >
      This link is invalid or incomplete.
      <nuxt-link to="/" class="block mt-2 underline">Create your own</nuxt-link>
    </div>
  </div>
</template>
<script setup>
import { decodeData } from "../utils/transformer";
const route = useRoute();
const decodedData = decodeData(route.query.data);
</script>
<style scoped></style>
