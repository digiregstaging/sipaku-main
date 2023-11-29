import { reactive } from "vue";

// modules
import { axiosClient } from "@/modules/axios";
import { getProject } from "@/modules/var";
import { decryptData } from "@/modules/encryption";

// modal action button
import LayerVue from "@/components/actionButton/Layer.vue";

export let gridApiLayer;
const { role } = JSON.parse(decryptData(sessionStorage.getItem("userData")));

export const columnOfLayerTable = reactive({
  value: [
    { headerName: "Layer Name", field: "name", flex: 1 },
    { headerName: "Layer Service", field: "name_layer", flex: 1 },
    { headerName: "URL Service", field: "url", flex: 1 },
    { headerName: "Year", field: "year" },
    {
      field: "Options",
      width: 90,
      cellRenderer: LayerVue,
      hide: role === "admin" ? false : true,
    },
  ],
});

export const updateLayerData = (data) => gridApiLayer.setRowData(data);

export const configLayerTable = {
  resizable: true,
};

export async function getLayers() {
  const response = await axiosClient.get(`/layers/?project=${getProject()}`);
  const { results } = response.data;
  return results;
}

export async function onLayerDataReady(params) {
  try {
    gridApiLayer = params.api;
    const layerList = await getLayers();
    updateLayerData(layerList);
  } catch (error) {
    console.log(error);
  }
}

function pagingDescription(curentPage, totalPages) {
  return `<span class="ag-paging-description" role="status">
    <span id="ag-25-start-page">Page</span>
    <span id="ag-25-start-page-number" ref="lbCurrent" class="ag-paging-number">${curentPage}</span>
    <span id="ag-25-of-page">of</span>
    <span id="ag-25-of-page-number" ref="lbTotal" class="ag-paging-number">${totalPages}</span>
  </span>`;
}

export function initPaginationLayer() {
  const totalPages = 1;
  $("#pagination-layers").twbsPagination({
    totalPages,
    visiblePages: 0,
    onPageClick: function (event, page) {
      // getNewPanorama(page);
      $(pagingDescription(page, totalPages)).insertAfter("#pagination-layers .prev-layers");
    },
    first: '<span class="ag-icon ag-icon-first"></span>',
    last: '<span class="ag-icon ag-icon-last"></span>',
    next: '<span class="ag-icon ag-icon-next"></span>',
    prev: '<span class="ag-icon ag-icon-previous"></span>',
    paginationClass: "ag-theme-alpine ag-paging-panel mb-0 me-4 border-top-0",
    nextClass: "ag-paging-button next-layers",
    prevClass: "ag-paging-button prev-layers",
    lastClass: "ag-paging-button",
    firstClass: "ag-paging-button",
    pageClass: "",
    activeClass: "",
    disabledClass: "ag-disabled",
    anchorClass: false,
  });
}
