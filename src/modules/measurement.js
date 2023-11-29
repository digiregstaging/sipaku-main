import { ref } from "vue";
import { containerMap } from "@/modules/map";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import Overlay from "ol/Overlay";
import Draw from "ol/interaction/Draw";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import { getLength, getArea } from "ol/sphere";
import { unByKey } from "ol/Observable";

export const selectedMeasurement = ref("clear");
let draw;
let sketch;
let helpTooltip;
let helpTooltipElement = null;
let measureTooltip;
let measureTooltipElement = null;
const continuePolygonMsg = "Click to continue drawing the polygon";
const continueLineMsg = "Click to continue drawing the line";

let sourceMeasurement = new VectorSource();
export const vectorMeasurement = new VectorLayer({
  source: sourceMeasurement,
  style: {
    "fill-color": "rgba(255, 255, 255, 0.2)",
    "stroke-color": "#ffcc33",
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": "#ffcc33",
  },
});

const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }

  let helpMsg = "Click to start drawing";

  if (sketch) {
    const geom = sketch.getGeometry();
    if (geom instanceof Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
};

const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};

export function addInteraction(type) {
  draw = new Draw({
    source: sourceMeasurement,
    type: type,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    }),
  });
  containerMap.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  let listener;
  draw.on("drawstart", function (evt) {
    // set sketch
    sketch = evt.feature;
    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on("change", function (evt) {
      const geom = evt.target;
      let output;
      if (geom instanceof Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on("drawend", function () {
    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
    measureTooltipElement.style = "color: #3598dc; font-weight: bold";
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
    unByKey(listener);
  });

  containerMap.on("pointermove", pointerMoveHandler);

  containerMap.getViewport().addEventListener("mouseout", function () {
    helpTooltipElement.classList.add("hidden");
  });
}

function createHelpTooltip() {
  if (helpTooltipElement) {
    // helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    helpTooltipElement.remove();
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = "ol-tooltip hidden";
  helpTooltipElement.style = "color: #61a1fe; font-weight: bold";
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  containerMap.addOverlay(helpTooltip);
}

function createMeasureTooltip() {
  if (measureTooltipElement) {
    // measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    measureTooltipElement.remove();
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
    stopEvent: false,
    insertFirst: false,
  });
  containerMap.addOverlay(measureTooltip);
}

export function clearMeasurement() {
  draw.setActive(false);
  sourceMeasurement.clear();
  removeElementsByClass("ol-tooltip");
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

export function disableRemoveMeasurement() {
  containerMap.removeInteraction(draw);
  // containerMap.getInteractions().pop();
  clearMeasurement();
}

export function addLineStringMeasurement() {
  containerMap.removeInteraction(draw);
  // containerMap.getInteractions().pop();
  addInteraction("LineString");
}

export function addAreaMeasurement() {
  containerMap.removeInteraction(draw);
  // containerMap.getInteractions().pop();
  addInteraction("Polygon");
}
