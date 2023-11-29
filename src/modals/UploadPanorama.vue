<script setup>
import { ref } from "vue";

const withMetadata = ref(false);
const yearNow = ref(new Date().getFullYear());
</script>

<template>
  <div class="modal fade" id="pano-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Upload Panorama</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form>
          <div class="modal-body">
            <label class="form-label">Images Panorama</label>
            <div class="input-group input-group-sm mb-2">
              <input type="file" class="form-control" id="image-pano" multiple accept=".png, .jpg, .jpeg" />
            </div>
            <label class="form-label">Metadata</label>
            <div class="input-group input-group-sm mb-2">
              <input type="file" class="form-control" :disabled="withMetadata === false" aria-label="Upload" accept=".csv" />
              <button @click="withMetadata = !withMetadata" class="btn btn-secondary" :class="withMetadata === true ? 'btn-success' : 'btn-secondary'" type="button">{{ withMetadata === true ? "With Metadata" : "Without Metadata" }}</button>
            </div>
            <div class="mb-2">
              <label class="form-label">Year</label>
              <input type="text" v-model="yearNow" class="form-control form-control-sm" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">Upload</button>
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
