<script setup>
import { watch } from "vue";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";

// modules
import { selectedBasemap, initTileLayer } from "@/modules/map";
import { popupPaneMap } from "@/modules/popup";

const baseMaps = [
  {
    label: "Open Street Map",
    value: "openStreetMap",
  },
  {
    label: "Google Satellite",
    value: "googleSatellite",
  },
  {
    label: "Google Road Map",
    value: "googleRoadMap",
  },
  {
    label: "Google Hybrid",
    value: "googleHybrid",
  },
  {
    label: "Google Terrain",
    value: "googleTerrain",
  },
  {
    label: "Esri World Imagery",
    value: "esriWorldImagery",
  },
  {
    label: "Esri World Street Map",
    value: "esriWorldStreetMap",
  },
  {
    label: "Esri World Topo Map",
    value: "esriWorldTopoMap",
  },
  {
    label: "Esri Gray Map",
    value: "esriGrayMap",
  },
];

watch(selectedBasemap, () => {
  switch (selectedBasemap.value) {
    case "openStreetMap":
      initTileLayer.setSource(new OSM());
      break;
    case "googleSatellite":
      initTileLayer.setSource(new XYZ({ url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" }));
      break;
    case "googleRoadMap":
      initTileLayer.setSource(new XYZ({ url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}" }));
      break;
    case "googleHybrid":
      initTileLayer.setSource(new XYZ({ url: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" }));
      break;
    case "googleTerrain":
      initTileLayer.setSource(new XYZ({ url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" }));
      break;
    case "esriWorldImagery":
      initTileLayer.setSource(new XYZ({ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" }));
      break;
    case "esriWorldStreetMap":
      initTileLayer.setSource(new XYZ({ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" }));
      break;
    case "esriWorldTopoMap":
      initTileLayer.setSource(new XYZ({ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" }));
      break;
    case "esriGrayMap":
      initTileLayer.setSource(new XYZ({ url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" }));
      break;
  }
});
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
    <div class="basemap" v-if="popupPaneMap.showBasemap">
      <div class="card">
        <div class="card-body px-2 py-1">
          <div class="form-check d-flex align-items-center gap-1" v-for="baseMap in baseMaps">
            <input v-model="selectedBasemap" :value="baseMap.value" class="form-check-input fs-7" name="flexRadioDefault" type="radio" :id="baseMap.value" />
            <label class="form-check-label fs-7" :for="baseMap.value">{{ baseMap.label }}</label>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.basemap {
  position: absolute;
  left: 2.5rem;
  bottom: 2.8rem;
  z-index: 11;
  .card-body {
    width: 15rem;
    overflow-y: auto;
  }
}
</style>
