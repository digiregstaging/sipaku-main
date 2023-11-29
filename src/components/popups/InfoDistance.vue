<script setup>
import { resultOfMeasureDistance, removeImgObjMeasurement, removeSpotMeasurement } from "@/modules/panorama";

function closePopup() {
  // hide box distance
  const boxDistance = new bootstrap.Toast(document.getElementById("distance"), {});
  boxDistance.hide();
  removeImgObjMeasurement();
  removeSpotMeasurement();
}
</script>

<template>
  <div class="toast" id="distance" role="alert" data-bs-autohide="false">
    <div class="toast-header">
      <strong class="me-auto">Distance</strong>
      <button type="button" class="btn-close" @click="closePopup"></button>
    </div>
    <div class="toast-body">{{ resultOfMeasureDistance }} Meter(s)</div>
  </div>
</template>

<style scoped>
.toast {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
