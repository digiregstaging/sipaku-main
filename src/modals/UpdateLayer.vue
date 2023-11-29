<script setup>
// modules
import { axiosClient } from "@/modules/axios";
import { updateLayerTempdata, hideUpdateLayerModal } from "@/modules/modalStates";
import { gridApiLayer, updateLayerData, getLayers } from "@/modules/tables/layer";
import { Toast } from "@/modules/var";

async function updateLayer() {
  const userId = sessionStorage.getItem("id");
  const organization = sessionStorage.getItem("organization");

  try {
    await axiosClient.put(`/layers/${updateLayerTempdata.id}/`, {
      name: updateLayerTempdata.name,
      project: updateLayerTempdata.projectId,
      url: updateLayerTempdata.url,
      name_layer: updateLayerTempdata.name_service,
      year: updateLayerTempdata.year,
      user: userId,
      organization,
    });

    gridApiLayer && gridApiLayer.showLoadingOverlay();

    // refetch with new data
    const layerList = await getLayers();
    updateLayerData(layerList);

    gridApiLayer && gridApiLayer.hideOverlay();

    Toast.fire({
      icon: "success",
      title: "Layer Updated!",
    });

    // close modal
    hideUpdateLayerModal();
  } catch (error) {
    console.error(error);

    Toast.fire({
      icon: "error",
      title: "Layer Not Updated!",
      text: "Please insert correct data",
    });
  }
}
</script>

<template>
  <div class="modal fade" id="update-layer-modal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Update New Layer</h1>
          <button type="button" class="btn-close" @click="hideUpdateLayerModal"></button>
        </div>
        <form @submit.prevent="updateLayer">
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Layer Name</label>
              <input type="text" class="form-control form-control-sm" v-model="updateLayerTempdata.name" />
            </div>
            <div class="mb-2">
              <label class="form-label">Layer Name Service</label>
              <input type="text" class="form-control form-control-sm" v-model="updateLayerTempdata.name_service" />
            </div>
            <div class="mb-2">
              <label class="form-label">Project</label>
              <select class="form-select form-select-sm">
                <option selected>Kumuh 360</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">URL Link</label>
              <input type="text" class="form-control form-control-sm" v-model="updateLayerTempdata.url" />
            </div>
            <div class="mb-2">
              <label class="form-label">Year</label>
              <input type="text" class="form-control form-control-sm" v-model="updateLayerTempdata.year" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="hideUpdateLayerModal">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">Update Layer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}
</style>
