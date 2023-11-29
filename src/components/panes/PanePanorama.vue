<script setup>
import { ref } from "vue";

// modules
import { zoomInPanorama, zoomOutPanorama, removeImgObjMeasurement, removeSpotMeasurement } from "@/modules/panorama";
import { popupPanePanorama, togglePanoramaInfo, toggleCorrection } from "@/modules/popup";
import { isLoadingMap, isLoadingPanorama, isPanoramaMeasurementOn } from "@/modules/states";
import { hidePanePanorama } from "@/modules/resizePane";

// components
import PanoramaInfoVue from "@/components/popups/PanoramaInfo.vue";
import InfoDistanceVue from "@/components/popups/InfoDistance.vue";

const closeBtn = ref(false);
const showBurgerMenu = ref(false);

function togglePanoramaMeasurement() {
  isPanoramaMeasurementOn.value = !isPanoramaMeasurementOn.value;
  popupPanePanorama.showPanoramaInfo = false;

  if (isPanoramaMeasurementOn.value === false) {
    removeImgObjMeasurement();
    removeSpotMeasurement();
    // hide box distance
    const boxDistance = new bootstrap.Toast(document.getElementById("distance"), {});
    boxDistance.hide();
  }
}
</script>

<template>
  <div class="close-btn" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="hidePanePanorama">
    <i class="fa-circle-xmark fa-lg" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
  </div>
  <div class="card-body p-0 w-100 h-100" id="wrapper-panorama">
    <div v-if="isLoadingPanorama" class="position-absolute top-50 start-50" :class="isLoadingMap ? 'text-dark' : 'text-white'"><i class="fa-solid fa-sync fa-spin fa-2xl"></i></div>
    <InfoDistanceVue />
  </div>
  <div class="card-footer d-flex justify-content-between">
    <ul class="d-flex m-0 p-0 gap-3">
      <li v-tippy="{ content: showBurgerMenu ? 'Close Menu' : 'Menu' }" @click="showBurgerMenu = !showBurgerMenu" class="tooltip-burger-menu">
        <i class="fa-solid cursor-pointer" :class="showBurgerMenu ? 'fa-xmark fa-lg' : 'fa-bars'"></i>
      </li>
      <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeInLeft animate__faster" leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
        <div v-if="showBurgerMenu" class="d-flex m-0 p-0 gap-3">
          <li v-tippy="{ content: 'Measurement' }" @click="togglePanoramaMeasurement">
            <i class="fa-solid fa-ruler cursor-pointer" :class="isPanoramaMeasurementOn && 'text-primary'" @click="toggleMeasurement"></i>
          </li>
          <li v-tippy="{ content: 'Information' }" @click="togglePanoramaInfo" v-if="isLoadingPanorama === false">
            <i class="fa-solid fa-circle-info cursor-pointer" :class="popupPanePanorama.showPanoramaInfo && 'text-primary'"></i>
          </li>
          <li v-tippy="{ content: 'Correction' }" @click="toggleCorrection">
            <i class="fa-solid fa-gear cursor-pointer" :class="popupPanePanorama.showCorrection && 'text-primary'"></i>
          </li>
        </div>
      </Transition>
    </ul>
    <ul class="d-flex m-0 gap-3">
      <li v-tippy="{ content: 'Zoom In' }" @click="zoomInPanorama">
        <i class="fa-solid fa-magnifying-glass-plus cursor-pointer"></i>
      </li>
      <li v-tippy="{ content: 'Zoom Out' }" @click="zoomOutPanorama">
        <i class="fa-solid fa-magnifying-glass-minus cursor-pointer"></i>
      </li>
    </ul>
  </div>
  <PanoramaInfoVue />
</template>

<style scoped>
.close-btn {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  cursor: pointer;
  z-index: 10;
}

.card-body {
  position: absolute;
  z-index: 1;
}

.card-footer {
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #eaeaea;
}
</style>
