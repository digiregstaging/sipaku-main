import { ref, reactive } from "vue";
import axios from "axios";

import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { defaults } from "ol/control";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { unByKey } from "ol/Observable";
import EsriJSON from "ol/format/EsriJSON";
import { bbox } from "ol/loadingstrategy";

// modules
import { axiosClient } from "@/modules/axios";
import { selectedMeasurement, vectorMeasurement } from "@/modules/measurement";
import { popupPaneMap, hidePopupPaneMap } from "@/modules/popup";
import { generateGeoserverWFSUrl, generateArcgisURL, getProject, hightLightWhenAttributeClick, selectStyle, customVectorStyles } from "@/modules/var";
import { showPanePanorama } from "@/modules/resizePane";
import { loadPanorama } from "@/modules/panorama";
import { isLoadingPanorama } from "@/modules/states";

export let containerMap;
export let zoomLevel = 17;
export const selectedBasemap = ref("googleSatellite");
export const featuresData = ref(null);
export const featuresPanorama = ref(null);
let listenerKeyPanorama;

export const isLayerActive = reactive({
  panorama: false,
});

export let initTileLayer = new TileLayer({
  source: new XYZ({
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  }),
});

export const panoramaLayer = new TileLayer({
  title: "panorama",
  zIndex: 10,
  source: new TileWMS({
    url: "https://geoserver.observer.xyz/geoserver/sipaku/wms?service=WMS",
    params: {
      LAYERS: "sipaku:v_panorama_360kumuh",
      TILED: true,
    },
    serverType: "geoserver",
    crossOrigin: "anonymous",
  }),
});

export const view = new View({
  center: new fromLonLat([0, 0]),
  zoom: zoomLevel,
});

export function initMap() {
  containerMap = new Map({
    target: "container-map",
    layers: [initTileLayer, hightLightWhenAttributeClick, vectorMeasurement],
    controls: new defaults({
      attribution: false,
      zoom: false,
      rotate: false,
    }),
    view,
  });

  containerMap.on("pointerdrag", function () {
    hidePopupPaneMap();
  });

  hightlightAndSaveDataWhenSelected();

  if (isLayerActive.panorama) {
    containerMap.addLayer(panoramaLayer);
    mapClickOnPanorama();
  }
}

export function resizeMap() {
  containerMap.updateSize();
}

export function zoomIn() {
  containerMap.getView().animate({
    zoom: containerMap.getView().getZoom() + 1,
    duration: 250,
  });
}

export function zoomOut() {
  containerMap.getView().animate({
    zoom: containerMap.getView().getZoom() - 1,
    duration: 250,
  });
}

export function createVectorLayer(layer) {
  if (layer.serverType === "arcgis") {
    return new VectorLayer({
      title: layer.name,
      source: new VectorSource({
        format: new EsriJSON(),
        url: (extent, resolution, projection) => generateArcgisURL(extent, projection, layer.url),
        strategy: bbox,
      }),
    });
  } else if (layer.serverType === "geoserver") {
    return new VectorLayer({
      title: layer.name,
      source: new VectorSource({
        url: generateGeoserverWFSUrl(layer.url, layer.name_layer),
        format: new GeoJSON(),
      }),
    });
  }
}

export function toggleVectorLayer(event, layer) {
  const isChecked = event.target.checked;
  if (isChecked) {
    containerMap.addLayer(createVectorLayer(layer));
  } else {
    let layerTitle = layer.name;
    containerMap.getLayers().forEach((layer) => {
      if (layer && layer.get("title") === layerTitle) {
        containerMap.removeLayer(layer);
      }
    });
  }
}

export function togglePanoramaLayer(event) {
  const isChecked = event.target.checked;
  if (isChecked) {
    containerMap.addLayer(panoramaLayer);
    mapClickOnPanorama();
  } else {
    containerMap.removeLayer(panoramaLayer);
    unByKey(listenerKeyPanorama);
  }
}

function hightlightAndSaveDataWhenSelected() {
  let select = null;
  if (select !== null) {
    containerMap.removeInteraction(select);
  }

  const selectClick = new Select({
    condition: click,
    style: function (feature) {
      return customVectorStyles[feature.getGeometry().getType()];
    },
  });

  select = selectClick;

  containerMap.addInteraction(select);
  select.on("select", function (e) {
    hightLightWhenAttributeClick.getSource().clear(); // remove hightlight attribute
    if (selectedMeasurement.value !== "clear") return; // if measurement is running don't run interaction on click
    if (!e.selected[0]) return; // if resource selected not found don't run interaction on click

    featuresData.value = e.selected[0].getProperties();
    delete featuresData.value.geometry; // hide geometry

    // panel state
    popupPaneMap.showMapInfo = true;
  });
}

function mapClickOnPanorama() {
  listenerKeyPanorama = containerMap.on("click", async function (evt) {
    const viewResolution = view.getResolution();
    const viewProjection = view.getProjection();
    const featurePanorama = panoramaLayer.getSource().getFeatureInfoUrl(evt.coordinate, viewResolution, viewProjection, { INFO_FORMAT: "application/json" });
    if (featurePanorama) {
      const response = await axios.get(featurePanorama);
      const { features, numberReturned } = response.data;
      if (numberReturned !== 0 && features[0].geometry.type === "Point") {
        isLoadingPanorama.value = true; // enable loading when fetching panorama
        const response = await axiosClient.get(`/panoramas/?project=${getProject()}&base_name=${features[0].properties.base_name}`);
        const { results } = response.data;
        featuresPanorama.value = results[0];

        showPanePanorama();
        loadPanorama(results[0].id, false, false);
      }
    }
  });
}
