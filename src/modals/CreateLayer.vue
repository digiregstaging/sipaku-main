<script setup>
import { reactive } from "vue";

// modules
import { axiosClient } from "@/modules/axios";
import { hideAddLayerModal } from "@/modules/modalStates";
import { gridApiLayer, updateLayerData, getLayers } from "@/modules/tables/layer";
import { getProject } from "@/modules/var";
import { Toast } from "@/modules/var";

const createLayerData = reactive({
  name: "",
  name_service: "",
  projectId: getProject(),
  url: "",
  year: new Date().getFullYear(),
});

async function createLayer() {
  const userId = sessionStorage.getItem("id");
  const organization = sessionStorage.getItem("organization");

  try {
    await axiosClient.post("/layers/", {
      name: createLayerData.name,
      project: createLayerData.projectId,
      url: createLayerData.url,
      name_layer: createLayerData.name_service,
      year: createLayerData.year,
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
      title: "Layer Added!",
    });

    hideAddLayerModal();
  } catch (error) {
    console.error(error);

    Toast.fire({
      icon: "error",
      title: "Layer Not Added!",
      text: "Please insert correct data",
    });
  }
}
</script>

<template>
  <div class="modal fade" id="add-layer-modal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Create New Layer</h1>
          <button type="button" class="btn-close" @click="hideAddLayerModal"></button>
        </div>
        <form @submit.prevent="createLayer">
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Layer Name</label>
              <input type="text" class="form-control form-control-sm" v-model="createLayerData.name" />
            </div>
            <div class="mb-2">
              <label class="form-label">Layer Name Service</label>
              <input type="text" class="form-control form-control-sm" v-model="createLayerData.name_service" />
            </div>
            <div class="mb-2">
              <label class="form-label">Project</label>
              <select class="form-select form-select-sm">
                <option selected>Kumuh 360</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">URL Link</label>
              <input type="text" class="form-control form-control-sm" v-model="createLayerData.url" />
            </div>
            <div class="mb-2">
              <label class="form-label">Year</label>
              <input type="number" class="form-control form-control-sm" v-model="createLayerData.year" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="hideAddLayerModal">Close</button>
            <button type="submit" class="btn btn-primary btn-sm">Add Layer</button>
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
