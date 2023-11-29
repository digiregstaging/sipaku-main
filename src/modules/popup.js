import { reactive } from "vue";

export const popupPaneMap = reactive({
  showBasemap: false,
  showLayers: false,
  showMeasurement: false,
  showQueryLegend: false,
  showMapInfo: false,
  showSupportTable: false,
  showAccInfo: false,
});

export function hidePopupPaneMap() {
  popupPaneMap.showBasemap = false;
  popupPaneMap.showLayers = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleBasemap() {
  popupPaneMap.showBasemap = !popupPaneMap.showBasemap;
  popupPaneMap.showLayers = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleLayers() {
  popupPaneMap.showBasemap = false;
  popupPaneMap.showLayers = !popupPaneMap.showLayers;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleMeasurement() {
  popupPaneMap.showBasemap = false;
  popupPaneMap.showLayers = false;
  popupPaneMap.showMeasurement = !popupPaneMap.showMeasurement;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleMapInfo() {
  popupPaneMap.showLayers = false;
  popupPaneMap.showBasemap = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showMapInfo = !popupPaneMap.showMapInfo;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleQueryLegend() {
  popupPaneMap.showLayers = false;
  popupPaneMap.showBasemap = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = !popupPaneMap.showQueryLegend;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = false;
}

export function toggleSupportTable() {
  popupPaneMap.showBasemap = false;
  popupPaneMap.showLayers = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = !popupPaneMap.showSupportTable;
  popupPaneMap.showAccInfo = false;
}

export function toggleAccInfo() {
  popupPaneMap.showBasemap = false;
  popupPaneMap.showLayers = false;
  popupPaneMap.showMeasurement = false;
  popupPaneMap.showQueryLegend = false;
  popupPaneMap.showSupportTable = false;
  popupPaneMap.showAccInfo = !popupPaneMap.showAccInfo;
}

export const popupPanePanorama = reactive({
  showPanoramaInfo: false,
  showCorrection: false,
});

export function hidePopupPanePanorama() {
  popupPanePanorama.showPanoramaInfo = false;
  popupPanePanorama.showCorrection = false;
}

export function togglePanoramaInfo() {
  popupPanePanorama.showPanoramaInfo = !popupPanePanorama.showPanoramaInfo;
  popupPanePanorama.showCorrection = false;
}

export function toggleCorrection() {
  popupPanePanorama.showPanoramaInfo = false;
  popupPanePanorama.showCorrection = !popupPanePanorama.showCorrection;
}
