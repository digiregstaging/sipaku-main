<script setup>
// modules
import { isShowAttributeTable, isShowLayerTable, isShowPanoramaTable, isShowAccountTable } from "@/modules/states";

// components
import AttributeTableVue from "@/components/tables/AttributeTable.vue";
import LayerTableVue from "@/components/tables/LayerTable.vue";
import PanoramaTableVue from "@/components/tables/PanoramaTable.vue";
import AccountTableVue from "@/components/tables/AccountTable.vue";
</script>

<template>
  <div v-if="isShowAttributeTable" style="height: 100%">
    <AttributeTableVue />
  </div>
  <div v-if="isShowLayerTable" style="height: 100%">
    <LayerTableVue />
  </div>
  <div v-if="isShowPanoramaTable" style="height: 100%">
    <PanoramaTableVue />
  </div>
  <div v-if="isShowAccountTable" style="height: 100%">
    <AccountTableVue />
  </div>
</template>
