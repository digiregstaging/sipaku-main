<script setup>
import Swal from "sweetalert2";

// modules
import { axiosClient } from "@/modules/axios";
import { showUpdateLayerModal, showStyleLayerModal } from "@/modules/modalStates";
import { gridApiLayer, updateLayerData, getLayers } from "@/modules/tables/layer";
import { Toast } from "@/modules/var";

defineProps(["params"]);

async function deleteLayer(data) {
  const { id } = data;
  Swal.fire({
    title: "Are you sure?",
    text: "Layers could't be able to revert!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0d6efd",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/layers/${id}/`);

        gridApiLayer && gridApiLayer.showLoadingOverlay();

        // refetch with new data
        const layerList = await getLayers();
        updateLayerData(layerList);

        gridApiLayer && gridApiLayer.hideOverlay();

        Toast.fire({
          icon: "success",
          title: "Layer Deleted!",
        });
      } catch (error) {
        console.error(error);

        Toast.fire({
          icon: "error",
          title: "Failed to Remove Layer!",
        });
      }
    }
  });
}
</script>

<template>
  <div class="d-flex gap-2">
    <span @click="showStyleLayerModal(params.data)"><i class="fa-solid fa-droplet cursor-pointer"></i></span>
    <span @click="showUpdateLayerModal(params.data)"><i class="fa-solid fa-pen-to-square cursor-pointer"></i></span>
    <span @click="deleteLayer(params.data)"><i class="fa-solid fa-trash cursor-pointer"></i></span>
  </div>
</template>
