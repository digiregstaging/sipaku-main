<script setup>
import { popupPanePanorama } from "@/modules/popup";
import { featuresPanorama } from "@/modules/map";
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn animate__faster" leave-active-class="animate__animated animate__zoomOut animate__faster">
    <div class="card" v-if="popupPanePanorama.showPanoramaInfo">
      <div class="card-body">
        <ol class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">Panorama ID</div>
              <span class="fs-7">{{ featuresPanorama.id }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">Base Name</div>
              <span class="fs-7">{{ featuresPanorama.base_name }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">Longitude</div>
              <span class="fs-7">{{ featuresPanorama.lon }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">Latitude</div>
              <span class="fs-7">{{ featuresPanorama.lat }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">UTM X</div>
              <span class="fs-7">{{ featuresPanorama.utm_x }}</span>
            </div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold fs-7">UTM Y</div>
              <span class="fs-7">{{ featuresPanorama.utm_y }}</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.card {
  position: absolute;
  z-index: 10;
  bottom: 2.8rem;
  left: 4.5rem;
  width: 20rem;
  .card-body {
    padding: 0.6rem 0;
    .list-group-item {
      border: none;
      padding: 0.2rem 1rem;
    }
  }
}
</style>
