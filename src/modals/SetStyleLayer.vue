<script setup>
import { hideStyleLayerModal } from "@/modules/modalStates";
</script>

<template>
  <div class="modal fade" id="style-layer-modal" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Styling Layer</h1>
          <button type="button" class="btn-close" @click="hideStyleLayerModal"></button>
        </div>
        <form @submit.prevent="">
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Color</label>
              <div class="d-flex gap-2 align-items-center">
                <input type="text" class="form-control form-control-sm" />
                <input type="color" id="colorInput" value="#563d7c" title="Choose your color" />
              </div>
            </div>
            <div class="mb-2">
              <label class="form-label">Stroke</label>
              <input type="number" class="form-control form-control-sm" />
            </div>
            <div class="mb-2">
              <label class="form-label">Type</label>
              <select class="form-select form-select-sm">
                <option selected>Select Type</option>
                <option value="1">Line</option>
                <option value="2">Polygon</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">Model</label>
              <select class="form-select form-select-sm">
                <option selected>Select Model</option>
                <option value="1">Solid</option>
                <option value="2">Dashed</option>
                <option value="2">Dot</option>
                <option value="2">Line Dot</option>
                <option value="2">Railroad</option>
                <option value="2">Labeled</option>
                <option value="2">Net</option>
                <option value="2">Transparent</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="hideStyleLayerModal">Close</button>
            <button type="submit" class="btn btn-primary btn-sm">Save Style</button>
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
