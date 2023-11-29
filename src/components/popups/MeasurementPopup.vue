<script setup>
import { watch } from "vue";
import { popupPaneMap } from "@/modules/popup";
import { selectedMeasurement, disableRemoveMeasurement, addLineStringMeasurement, addAreaMeasurement } from "@/modules/measurement";

watch(selectedMeasurement, function () {
  switch (selectedMeasurement.value) {
    case "length":
      addLineStringMeasurement();
      break;
    case "area":
      addAreaMeasurement();
      break;
    default:
      disableRemoveMeasurement();
  }
});
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
    <div class="measurement" v-if="popupPaneMap.showMeasurement">
      <div class="card">
        <div class="card-body px-2 py-1">
          <div class="form-check d-flex align-items-center gap-1">
            <input v-model="selectedMeasurement" value="clear" class="form-check-input fs-7" name="flexRadioDefault" type="radio" id="clear" />
            <label class="form-check-label fs-7" for="clear">Clear Measurement</label>
          </div>
          <div class="form-check d-flex align-items-center gap-1">
            <input v-model="selectedMeasurement" value="length" class="form-check-input fs-7" name="flexRadioDefault" type="radio" id="length" />
            <label class="form-check-label fs-7" for="length">Length (Line String)</label>
          </div>
          <div class="form-check d-flex align-items-center gap-1">
            <input v-model="selectedMeasurement" value="area" class="form-check-input fs-7" name="flexRadioDefault" type="radio" id="area" />
            <label class="form-check-label fs-7" for="area">Area (Polygon)</label>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.measurement {
  position: absolute;
  left: 6.5rem;
  bottom: 2.8rem;
  z-index: 11;
  .card-body {
    width: 15rem;
    overflow-y: auto;
  }
}
</style>
