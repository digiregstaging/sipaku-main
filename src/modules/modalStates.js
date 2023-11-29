import { reactive } from "vue";

export const updateLayerTempdata = reactive({
  id: "",
  name: "",
  name_service: "",
  projectId: "",
  url: "",
  year: 0,
});

let layerModal;
let layerSetStyleModal;
let panoModal;
let accountInfoModal;
let account2InfoModal;

export function showAddLayerModal() {
  layerModal = new bootstrap.Modal(document.getElementById("add-layer-modal"), {});
  layerModal.show();
}

export function hideAddLayerModal() {
  layerModal.hide();
}

export function showUpdateLayerModal(data) {
  layerModal = new bootstrap.Modal(document.getElementById("update-layer-modal"), {});
  layerModal.show();

  const { id, name, project, url, name_layer, year } = data;
  updateLayerTempdata.id = id;
  updateLayerTempdata.name = name;
  updateLayerTempdata.projectId = project;
  updateLayerTempdata.url = url;
  updateLayerTempdata.name_service = name_layer;
  updateLayerTempdata.year = year;
}

export function hideUpdateLayerModal() {
  layerModal.hide();

  updateLayerTempdata.id = "";
  updateLayerTempdata.name = "";
  updateLayerTempdata.projectId = "";
  updateLayerTempdata.url = "";
  updateLayerTempdata.name_service = "";
  updateLayerTempdata.year = 0;
}

export function showStyleLayerModal() {
  layerSetStyleModal = new bootstrap.Modal(document.getElementById("style-layer-modal"), {});
  layerSetStyleModal.show();
}

export function hideStyleLayerModal() {
  layerSetStyleModal.hide();
}

export function showAddPanoModal() {
  panoModal = new bootstrap.Modal(document.getElementById("pano-modal"), {});
  panoModal.show();
}

export function hideAddPanoModal() {
  panoModal.hide();
}

export function showAccInfoModal() {
  accountInfoModal = new bootstrap.Modal(document.getElementById("acc-info-modal"), {});
  accountInfoModal.show();
}

export const acc2InfoData = reactive({
  id: "",
  username: "",
  email: "",
  role: "",
});
export function showAcc2InfoModal(data) {
  account2InfoModal = new bootstrap.Modal(document.getElementById("acc2-info-modal"), {});
  account2InfoModal.show();

  acc2InfoData.id = data.id;
  acc2InfoData.username = data.username;
  acc2InfoData.email = data.email;
  acc2InfoData.role = data.role;
}

export function hideAcc2InfoModal() {
  account2InfoModal.hide();
}
