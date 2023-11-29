<script setup>
import { ref } from "vue";

// modules
import { zoomIn, zoomOut } from "@/modules/map";
import { popupPaneMap, toggleBasemap, toggleLayers, toggleMeasurement, toggleMapInfo, toggleSupportTable, toggleAccInfo } from "@/modules/popup";
import { isLoadingMap, isShowAttributeTable, showAttributeTable } from "@/modules/states";

// components
import BasemapPopupVue from "@/components/popups/BasemapPopup.vue";
import LayersPopupVue from "@/components/popups/LayersPopup.vue";
import MeasurementPopupVue from "@/components/popups/MeasurementPopup.vue";
import MapInfoPopupVue from "@/components/popups/MapInfoPopup.vue";
import SupportTablePopupVue from "@/components/popups/SupportTablePopup.vue";
import AccountInfoPopupVue from "@/components/popups/AccountInfoPopup.vue";

const showBurgerMenu = ref(false);
</script>

<template>
  <div class="logo-sipaku">
    <img src="/logo.png" alt="logo sipaku" />
  </div>
  <div class="card-body d-flex flex-grow-1 p-0 w-100" id="container-map">
    <div v-if="isLoadingMap" style="z-index: 100" class="position-absolute top-50 start-50"><i class="fa-solid fa-sync fa-spin fa-2xl"></i></div>
  </div>
  <div class="card-footer d-flex justify-content-between">
    <ul class="d-flex m-0 p-0 gap-3">
      <li v-tippy="{ content: showBurgerMenu ? 'Close Menu' : 'Menu' }" @click="showBurgerMenu = !showBurgerMenu" class="tooltip-burger-menu">
        <i class="fa-solid cursor-pointer" :class="showBurgerMenu ? 'fa-xmark fa-lg' : 'fa-bars'"></i>
      </li>
      <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeInLeft animate__faster" leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
        <div v-if="showBurgerMenu" class="d-flex m-0 p-0 gap-3">
          <li v-tippy="{ content: 'Basemap' }" @click="toggleBasemap">
            <i class="fa-solid fa-map cursor-pointer" :class="popupPaneMap.showBasemap && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Layers' }" @click="toggleLayers">
            <i class="fa-solid fa-layer-group cursor-pointer" :class="popupPaneMap.showLayers && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Measurement Type' }" @click="toggleMeasurement">
            <i class="fa-solid fa-ruler cursor-pointer" :class="popupPaneMap.showMeasurement && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Attributes' }" @click="showAttributeTable">
            <i class="fa-solid fa-magnifying-glass cursor-pointer" :class="isShowAttributeTable && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Information' }" @click="toggleMapInfo">
            <i class="fa-solid fa-circle-info cursor-pointer" :class="popupPaneMap.showMapInfo && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Options' }" @click="toggleSupportTable">
            <i class="fa-solid fa-table cursor-pointer" :class="popupPaneMap.showSupportTable && 'text-primary'"></i>
          </li>
        </div>
      </Transition>
    </ul>
    <ul class="d-flex m-0 gap-3">
      <li v-tippy="{ content: 'Account Information' }" @click="toggleAccInfo">
        <i class="fa-solid fa-user cursor-pointer" :class="popupPaneMap.showAccInfo && 'text-primary'"></i>
      </li>
      <li v-tippy="{ content: 'Zoom In' }" @click="zoomIn">
        <i class="fa-solid fa-magnifying-glass-plus cursor-pointer"></i>
      </li>
      <li v-tippy="{ content: 'Zoom Out' }" @click="zoomOut">
        <i class="fa-solid fa-magnifying-glass-minus cursor-pointer"></i>
      </li>
    </ul>
  </div>
  <BasemapPopupVue />
  <LayersPopupVue />
  <MeasurementPopupVue />
  <MapInfoPopupVue />
  <SupportTablePopupVue />
  <AccountInfoPopupVue />
</template>
