<script setup>
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component

// modules
import { decryptData } from "@/modules/encryption";
import { hideAttributeTable } from "@/modules/states";
import { onLayerDataReady, columnOfLayerTable, configLayerTable } from "@/modules/tables/layer";

// modals
import { showAddLayerModal } from "@/modules/modalStates";
import CreateLayerVue from "@/modals/CreateLayer.vue";
import UpdateLayerVue from "@/modals/UpdateLayer.vue";
import SetStyleLayerVue from "@/modals/SetStyleLayer.vue";

const closeBtn = ref(false);
const { role } = JSON.parse(decryptData(sessionStorage.getItem("userData")));
</script>

<template>
  <div style="height: 13%" class="d-flex align-items-center justify-content-between mx-2">
    <button v-if="role === 'admin'" type="button" class="btn btn-primary btn-sm" @click="showAddLayerModal">Create New Layer</button>
    <div class="close-btn cursor-pointer" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="() => hideAttributeTable()">
      <i class="fa-circle-xmark fa-xl" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
    </div>
  </div>
  <CreateLayerVue v-if="role === 'admin'" />
  <UpdateLayerVue v-if="role === 'admin'" />
  <SetStyleLayerVue v-if="role === 'admin'" />
  <ag-grid-vue class="ag-theme-alpine" style="height: 75%" @grid-ready="onLayerDataReady" :columnDefs="columnOfLayerTable.value" :defaultColDef="configLayerTable" rowSelection="single" animateRows="true" />
  <ul id="pagination-layers" style="height: 12%"></ul>
</template>
