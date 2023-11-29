import { reactive } from "vue";

// modules
import { containerMap, createVectorLayer } from "@/modules/map";
import { getProject } from "@/modules/var";
import { axiosClient } from "@/modules/axios";

export const layerList = reactive({
  sipaku: [],
});

export async function getLayers() {
  const response = await axiosClient.get("/layers/", {
    params: {
      project: getProject(),
    },
  });
  const { results } = response.data;
  addCustomVariable(results);
  layerList.sipaku = results;

  checkLayerShow();
}

function addCustomVariable(layers) {
  // add show variable
  layers.map((layer) => {
    Object.assign(layer, { show: false });
  });

  // add server type variable
  layers.map((layer) => {
    if (layer.url.includes("geoserver")) {
      Object.assign(layer, { serverType: "geoserver" });
    } else {
      Object.assign(layer, { serverType: "arcgis" });
    }
  });
}

function checkLayerShow() {
  layerList.sipaku.filter((layer) => layer.show && containerMap.addLayer(createVectorLayer(layer)));
}
