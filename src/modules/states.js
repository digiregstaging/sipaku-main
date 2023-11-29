import { ref, reactive } from "vue";

// modules
import { openAttributeTable, closeAttributeTable } from "@/modules/resizePane";

export const paneSize = reactive({
  map: 50,
  pano: 50,
  top: 100,
  bottom: 0,
});

export const isLoadingMap = ref(false);
export const isLoadingPanorama = ref(false);
export const isLoadingAttributes = ref(false);
export const isShowAttributeTable = ref(false);
export const isShowLayerTable = ref(false);
export const isShowPanoramaTable = ref(false);
export const isShowAccountTable = ref(false);
export const isPanoramaMeasurementOn = ref(false);

export function showAttributeTable() {
  isShowAttributeTable.value = !isShowAttributeTable.value;
  isShowLayerTable.value = false;
  isShowPanoramaTable.value = false;
  isShowAccountTable.value = false;

  isShowAttributeTable.value ? openAttributeTable() : closeAttributeTable();
}

export function hideAttributeTable() {
  isShowAttributeTable.value = false;
  closeAttributeTable();
}

export function showLayerTable() {
  isShowAttributeTable.value = false;
  isShowLayerTable.value = !isShowLayerTable.value;
  isShowPanoramaTable.value = false;
  isShowAccountTable.value = false;

  isShowLayerTable.value ? openAttributeTable() : closeAttributeTable();
}

export function showPanoramaTable() {
  isShowAttributeTable.value = false;
  isShowLayerTable.value = false;
  isShowPanoramaTable.value = !isShowPanoramaTable.value;
  isShowAccountTable.value = false;

  isShowPanoramaTable.value ? openAttributeTable() : closeAttributeTable();
}

export function toggleAccountTable() {
  isShowAttributeTable.value = false;
  isShowLayerTable.value = false;
  isShowPanoramaTable.value = false;
  isShowAccountTable.value = !isShowAccountTable.value;

  isShowAccountTable.value ? openAttributeTable() : closeAttributeTable();
}

export function hideAccountTable() {
  isShowAccountTable.value = false;
  closeAttributeTable();
}
