<script setup>
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component

// modules
import { decryptData } from "@/modules/encryption";
import { hideAccountTable } from "@/modules/states";
import { onAccountDataReady, columnOfAccountTable, configAccountTable } from "@/modules/tables/account";

// modals
import InfoAccVue from "@/modals/account/Info.vue";

const closeBtn = ref(false);
const { role } = JSON.parse(decryptData(sessionStorage.getItem("userData")));
</script>

<template>
  <div style="height: 13%" class="d-flex align-items-center justify-content-between mx-2">
    <div></div>
    <div class="close-btn cursor-pointer" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="hideAccountTable">
      <i class="fa-circle-xmark fa-xl" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
    </div>
  </div>
  <InfoAccVue v-if="role === 'admin'" />
  <ag-grid-vue class="ag-theme-alpine" style="height: 87%" @grid-ready="onAccountDataReady" :pagination="true" :columnDefs="columnOfAccountTable" :defaultColDef="configAccountTable" rowSelection="single" animateRows="true" />
</template>
