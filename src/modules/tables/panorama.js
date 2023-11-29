import { reactive, ref } from "vue";
import { axiosClient } from "@/modules/axios";
import { loadPanorama } from "@/modules/panorama";
import { getProject } from "@/modules/var";

let gridApiPano;
let currentPanoramaPage = 1;
export const searchKeyword = ref("");

export const columnOfPanoramaTable = reactive({
  value: [
    {
      headerName: "Image Name",
      field: "base_name",
      flex: 1,
    },
    { headerName: "Shooting Time", field: "shooting_time", flex: 1 },
    { headerName: "Latitude", field: "lat" },
    { headerName: "Longitude", field: "lon" },
    { headerName: "Year", field: "year" },
  ],
});

export const configPanoramaTable = {
  resizable: true,
};

const updateData = (data) => gridApiPano.setRowData(data);

export function onSelectionCellPanorama() {
  const selectedRows = gridApiPano.getSelectedRows();
  const { id } = selectedRows[0];
  loadPanorama(id, false);
}

export async function getPanoramaByKeyword(destroyPagination = false) {
  destroyPagination && destroyPaginationPanorama();
  try {
    gridApiPano.showLoadingOverlay(); // show loading

    const response = await axiosClient.get(`/panoramas/?p=${currentPanoramaPage}&page_size=10&search=${searchKeyword.value}&project=${getProject()}`);
    const { count, results } = response.data;
    updateData(results);

    gridApiPano.hideOverlay(); // hide loading

    destroyPagination && initPaginationPanorama(count);
  } catch (error) {
    console.log(error);
  }
}

export async function getPanorama(destroyPagination = false) {
  destroyPagination && destroyPaginationPanorama();
  try {
    gridApiPano.showLoadingOverlay(); // show loading

    const response = await axiosClient.get(`/panoramas/?p=${currentPanoramaPage}&page_size=10&project=${getProject()}`);

    const { count, results } = response.data;
    updateData(results);

    gridApiPano.hideOverlay(); // hide loading

    destroyPagination && initPaginationPanorama(count);
  } catch (error) {
    console.log(error);
  }
}

export async function onPanoDataReady(params) {
  try {
    gridApiPano = params.api;
    const response = await axiosClient.get(`/panoramas/?p=${currentPanoramaPage}&page_size=10&project=${getProject()}`);
    const { count, results } = response.data;

    updateData(results);

    initPaginationPanorama(count);
  } catch (error) {
    console.log(error);
  }
}

function pagingDescription(currentPage, totalPages) {
  const desc = `<span class="ag-paging-description panorama-description" role="status">
    <span id="ag-25-start-page">Page</span>
    <span id="ag-25-start-page-number" ref="lbCurrent" class="ag-paging-number">${currentPage}</span>
    <span id="ag-25-of-page">of</span>
    <span id="ag-25-of-page-number" ref="lbTotal" class="ag-paging-number">${totalPages}</span>
  </span>`;
  $(desc).insertAfter("#pagination-panorama .prev-panorama");
}

export function initPaginationPanorama(count) {
  let totalPages = Math.ceil(count / 10);
  $("#pagination-panorama").twbsPagination({
    totalPages,
    visiblePages: 0,
    onPageClick: function (event, page) {
      currentPanoramaPage = page;
      if (searchKeyword) {
        getPanoramaByKeyword();
      } else {
        getPanorama();
      }
      pagingDescription(currentPanoramaPage, totalPages);
    },
    first: '<span class="ag-icon ag-icon-first"></span>',
    last: '<span class="ag-icon ag-icon-last"></span>',
    next: '<span class="ag-icon ag-icon-next"></span>',
    prev: '<span class="ag-icon ag-icon-previous"></span>',
    paginationClass: "ag-theme-alpine ag-paging-panel mb-0 me-4 border-top-0",
    nextClass: "ag-paging-button next-panorama",
    prevClass: "ag-paging-button prev-panorama",
    lastClass: "ag-paging-button",
    firstClass: "ag-paging-button",
    pageClass: "",
    activeClass: "",
    disabledClass: "ag-disabled",
    anchorClass: false,
  });
}

export function destroyPaginationPanorama() {
  $("#pagination-panorama").twbsPagination("destroy");
}
