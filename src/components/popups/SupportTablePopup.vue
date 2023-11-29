<script setup>
// modules
import { popupPaneMap } from "@/modules/popup";
import { isShowLayerTable, isShowPanoramaTable, showLayerTable, showPanoramaTable } from "@/modules/states";
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
    <div class="support-table" v-if="popupPaneMap.showSupportTable">
      <div class="card">
        <div class="card-body px-2 py-1">
          <div class="form-check d-flex align-items-center gap-1">
            <input class="form-check-input fs-7" name="flexRadioDefault" type="radio" :checked="isShowLayerTable" @click="showLayerTable" />
            <label class="form-check-label fs-7">Layer</label>
          </div>
          <div class="form-check d-flex align-items-center gap-1">
            <input class="form-check-input fs-7" name="flexRadioDefault" type="radio" :checked="isShowPanoramaTable" @click="showPanoramaTable" />
            <label class="form-check-label fs-7">Panorama</label>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.support-table {
  position: absolute;
  left: 12.5rem;
  bottom: 2.8rem;
  z-index: 11;
  .card-body {
    width: 8rem;
    overflow-y: auto;
  }
}
</style>
