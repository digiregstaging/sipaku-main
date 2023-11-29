<script setup>
import { ref, watch } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component

// modules
import { layerList } from "@/modules/api";
import { hideAttributeTable } from "@/modules/states";
import { getDataWithDynamicTable, configAttributeTable, onAttributeDataReady, onFilterTextBoxChanged } from "@/modules/tables/attribute";

const closeBtn = ref(false);
const selectedWFS = ref({}); // default WFS

watch(selectedWFS, (newValue, oldValue) => {
  getDataWithDynamicTable(newValue);
});
</script>

<template>
  <div style="height: 13%" class="d-flex align-items-center justify-content-between mx-2">
    <div class="d-flex gap-2">
      <select class="form-select form-select-sm" v-model="selectedWFS">
        <option disabled :value="{}">Choose Available WFS</option>
        <option v-for="layer in layerList.kumuh360" :key="layer.id" :value="layer">{{ layer.name }}</option>
      </select>
      <div class="input-group input-group-sm">
        <span class="input-group-text">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
        <input type="text" class="form-control" placeholder="Keyword" @input="(event) => onFilterTextBoxChanged(event)" />
      </div>
    </div>
    <div class="close-btn cursor-pointer" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="() => hideAttributeTable()">
      <i class="fa-circle-xmark fa-lg" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
    </div>
  </div>
  <ag-grid-vue class="ag-theme-alpine" style="height: 87%" @grid-ready="onAttributeDataReady" :cacheQuickFilter="true" :pagination="true" :autoGroupColumnDef="{ minWidth: 170 }" paginationPageSize="10" :defaultColDef="configAttributeTable" rowSelection="single" animateRows="true" />
</template>
