<script setup>
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import EsriJSON from "ol/format/EsriJSON";

// modules
import { containerMap } from "@/modules/map";
import { featuresData, serverType } from "@/modules/tables/attribute";
import { hightLightWhenAttributeClick } from "@/modules/var";
import { featuresData as featuresInformation } from "@/modules/map";

defineProps(["params"]);

function zoomByCoordinates(data) {
  const feature = featuresData.find(function (feature) {
    if (serverType === "geoserver") {
      return feature.properties.uuid === data.uuid;
    } else {
      return feature.attributes.uuid === data.uuid;
    }
  });

  function geometry() {
    if (serverType === "geoserver") {
      featuresInformation.value = feature.properties;
      console.log(feature.geometry);
      return new GeoJSON({ featureProjection: containerMap.getView().getProjection() }).readGeometry(feature.geometry);
    } else {
      featuresInformation.value = feature.attributes;
      console.log(feature);
      return new EsriJSON().readGeometry(feature.geometry);
    }
  }

  hightLightWhenAttributeClick.getSource().clear();
  hightLightWhenAttributeClick.getSource().addFeature(new Feature(geometry()));
  containerMap.getView().fit(geometry(), containerMap.getSize());
}
</script>

<template>
  <div class="d-flex gap-2">
    <span @click="zoomByCoordinates(params.data)"><i class="fa-solid fa-search cursor-pointer"></i></span>
  </div>
</template>
