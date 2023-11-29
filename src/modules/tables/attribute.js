import axios from "axios";

import { generateGeoserverWFSUrl } from "@/modules/var";
import AttributeVue from "@/components/actionButton/Attribute.vue";

export let gridApiAttribute;
let gridColumnApiAttribute;
export let featuresData = [];
export let serverType = "";

export const configAttributeTable = {
  resizable: true,
};

export function onAttributeDataReady(params) {
  gridApiAttribute = params.api;
  gridColumnApiAttribute = params.columnApi;
  autoSizeColumns();
  gridApiAttribute.hideOverlay();
}

export function onFilterTextBoxChanged(event) {
  gridApiAttribute.setQuickFilter(event.target.value);
}

function autoSizeColumns() {
  const allColumnIds = [];
  gridColumnApiAttribute.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });
  gridColumnApiAttribute.autoSizeColumns(allColumnIds, false);
}

function generateArcgisURL(url) {
  const extent = [8353313.775117298, -3445725.37384124, 15542331.711382687, 3384573.7448304594];
  const layerId = "0";
  // ArcGIS Server only wants the numeric portion of the projection ID.
  const srid = "EPSG:3857".split(/:(?=\d+$)/).pop();
  return url + "/" + layerId + "/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" + encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' + extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] + ',"spatialReference":{"wkid":' + srid + "}}") + "&geometryType=esriGeometryEnvelope&inSR=" + srid + "&outFields=*" + "&outSR=" + srid;
}

export async function getDataWithDynamicTable(layer) {
  serverType = layer.serverType;
  gridApiAttribute.showLoadingOverlay();

  const data = []; // reset old data
  featuresData = []; // reset old data

  const colDefs = gridApiAttribute.getColumnDefs();
  colDefs.length = 0;
  colDefs.push({
    field: "Action",
    width: 90,
    cellRenderer: AttributeVue,
  });

  if (layer.serverType === "geoserver") {
    const resultUrl = generateGeoserverWFSUrl(layer.url, layer.name_layer);
    const response = await axios.get(resultUrl);
    const { features } = response.data;

    features.map((feature) => {
      featuresData.push(feature);
      data.push(Object.assign(feature.properties, { uuid: crypto.randomUUID() }));
    });

    const keys = Object.keys(features[0].properties);
    keys.forEach((key) =>
      colDefs.push({
        field: key,
      })
    );
  } else {
    const resultUrl = generateArcgisURL(layer.url);
    const response = await axios.get(resultUrl);
    const { features } = response.data;

    features.map((feature) => {
      featuresData.push(feature);
      data.push(Object.assign(feature.attributes, { uuid: crypto.randomUUID() }));
    });

    const keys = Object.keys(features[0].attributes);
    keys.forEach((key) =>
      colDefs.push({
        field: key,
      })
    );
  }

  gridApiAttribute.setColumnDefs(colDefs);
  gridApiAttribute.setRowData(data);
  gridApiAttribute.hideOverlay();
}
