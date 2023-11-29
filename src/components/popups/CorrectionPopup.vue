<script setup>
import { onMounted } from "vue";

// modules
import { popupPanePanorama } from "@/modules/popup";
import { axiosBasicAuth } from "@/modules/axios";
import { Toast } from "@/modules/var";
import { panoramaData, correctionData, fixChanged, defaultCorrectionData } from "@/modules/panorama";
import { positionCorrectionPopup, draggableCorrectionPopup } from "@/modules/dragable";

async function updateCorrection() {
  const { id: base_id } = panoramaData;
  const { id, yField, xField, hField, rollField, pitchField, trackField, noteField } = correctionData;

  try {
    await axiosBasicAuth.put("/rest/api/correct/", {
      base_id,
      drift_x: xField,
      drift_y: yField,
      height: hField,
      roll: rollField,
      pitch: pitchField,
      track: trackField,
      X_API_KEY: import.meta.env.VITE_APP_X_API_KEY,
      id,
    });

    Toast.fire({
      icon: "success",
      title: "Correction Value has been saved!",
    });
  } catch (error) {
    console.error(error);

    Toast.fire({
      icon: "error",
      title: "Correction Value not saved!",
    });
  }
}

function resetCorrection() {
  const { yField, xField, hField, rollField, pitchField, trackField } = defaultCorrectionData;

  correctionData.yField = yField;
  correctionData.xField = xField;
  correctionData.hField = hField;
  correctionData.rollField = rollField;
  correctionData.pitchField = pitchField;
  correctionData.trackField = trackField;

  fixChanged();
}

onMounted(() => {
  draggableCorrectionPopup("#correction-panorama");
});
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn animate__faster" leave-active-class="animate__animated animate__zoomOut animate__faster">
    <div class="card" id="correction-panorama" :style="`transform: translate(${positionCorrectionPopup.x}px, ${positionCorrectionPopup.y}px)`" v-if="popupPanePanorama.showCorrection">
      <div class="card-body">
        <form>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Drift Along track axis</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.yField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Drift by side track axis</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.xField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Height from ground</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.hField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Roll angle</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.rollField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Pitch angle</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.pitchField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-sm-6 col-form-label">Track angle</label>
            <div class="col-sm-6">
              <input type="number" @change="fixChanged" v-model="correctionData.trackField" placeholder="0.00" step=".2" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-primary btn-sm mt-1" @click="updateCorrection">Keep</button>
            <button type="button" class="btn btn-danger btn-sm mt-1" @click="resetCorrection">Discard</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.card {
  position: absolute;
  right: 0.4rem;
  bottom: 3.5rem;
  z-index: 100;
  width: 12rem;
  .col-form-label {
    font-size: 0.65rem;
  }
}
</style>
