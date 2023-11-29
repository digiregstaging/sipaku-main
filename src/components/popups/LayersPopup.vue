<script setup>
// modules
import { popupPaneMap } from "@/modules/popup";
import { isLayerActive, toggleVectorLayer, togglePanoramaLayer } from "@/modules/map";
import { layerList } from "@/modules/api";
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
    <div class="layers" v-if="popupPaneMap.showLayers">
      <div class="card">
        <div class="card-body px-2 py-1">
          <ul class="list-unstyled ps-0 mb-0">
            <li>
              <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#kumuh-360" aria-expanded="true">Kumuh 360</button>
              <div class="collapse show" id="kumuh-360">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li class="form-check" v-for="layer in layerList.sipaku" :key="layer.id">
                    <input class="form-check-input" v-model="layer.show" type="checkbox" :value="layer.name" :id="layer.name_layer" @change="(evt) => toggleVectorLayer(evt, layer)" />
                    <label class="form-check-label user-select-none text-capitalize" :for="layer.name_layer">{{ layer.name }}</label>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#panorama-data" aria-expanded="true">360 Data</button>
              <div class="collapse show" id="panorama-data">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li class="form-check">
                    <input class="form-check-input" v-model="isLayerActive.panorama" type="checkbox" value="panorama" id="panorama" @change="(evt) => togglePanoramaLayer(evt, layer)" />
                    <label class="form-check-label user-select-none" for="panorama">Panorama</label>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.layers {
  position: absolute;
  left: 4.5rem;
  bottom: 2.8rem;
  z-index: 11;
  overflow-y: auto;
  overflow-x: hidden;
  height: auto;
  .card-body {
    width: 15rem;
  }
}

.btn {
  &:focus {
    box-shadow: none;
  }
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  background-color: transparent;
  border: 0;
  &::before {
    width: 1em;
    line-height: 0;
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-plus' viewBox='0 0 16 16'%3E%3Cpath d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/%3E%3C/svg%3E");
  }
}

.btn-toggle[aria-expanded="true"] {
  &::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dash' viewBox='0 0 16 16'%3E%3Cpath d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
  }
}

.btn-toggle-nav {
  .form-check {
    margin-left: 1.7rem;
    font-size: 0.8rem;
  }
}
</style>
