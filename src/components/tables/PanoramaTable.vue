<script setup>
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component

// modules
import { searchKeyword, onPanoDataReady, columnOfPanoramaTable, configPanoramaTable, onSelectionCellPanorama, getPanoramaByKeyword, getPanorama } from "@/modules/tables/panorama";

const closeBtn = ref(false);
</script>

<template>
  <div style="height: 13%" class="d-flex align-items-center justify-content-between mx-2">
    <div class="input-group input-group-sm" style="width: 20%">
      <input type="text" class="form-control" placeholder="Kata kunci" v-model="searchKeyword" />
      <span class="input-group-text" v-tippy="{ content: 'Cari' }" @click="searchKeyword ? getPanoramaByKeyword(true) : getPanorama(true)">
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
    </div>
    <div class="close-btn cursor-pointer" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="() => hideAttributeTable()">
      <i class="fa-circle-xmark fa-xl" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
    </div>
  </div>
  <ag-grid-vue class="ag-theme-alpine" style="height: 75%" :suppressPaginationPanel="false" @selection-changed="onSelectionCellPanorama" @grid-ready="onPanoDataReady" :pagination="false" :columnDefs="columnOfPanoramaTable.value" :defaultColDef="configPanoramaTable" rowSelection="single" animateRows="true" />
  <ul id="pagination-panorama" style="height: 12%"></ul>
</template>

<style lang="scss" scoped>
.input-group-text {
  cursor: pointer;
  i:hover {
    color: #57a4ff;
  }
}
</style>
