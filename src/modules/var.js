import Swal from "sweetalert2";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export const timeOut = 400; // milisecond

export function getProject() {
  let currentUrl = window.location.href;
  let getUrl = new URL(currentUrl);
  let searchParams = new URLSearchParams(getUrl.search);
  return searchParams.get("project");
}

export function getYear() {
  let currentUrl = window.location.href;
  let getUrl = new URL(currentUrl);
  let searchParams = new URLSearchParams(getUrl.search);
  return searchParams.get("year");
}

export let format = function (fmt, ...args) {
  return fmt.split("%%").reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ""), "");
};

export function getDistanceFromLatLonInMetres(lat1, lon1, lat2, lon2) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const hightLightWhenAttributeClick = new VectorLayer({
  source: new VectorSource(),
  zIndex: 100,
  style: function (feature) {
    return customVectorStyles[feature.getGeometry().getType()];
  },
});

export function generateGeoserverWFSUrl(url, params) {
  const modifiedUrl = url.replaceAll("WMS", "WFS");
  return `${modifiedUrl}&version=1.1.0&request=GetFeature&typeName=${params}&styles=&outputFormat=application/json`;
}

export function generateArcgisURL(extent, projection, url) {
  const layerId = "0";
  // ArcGIS Server only wants the numeric portion of the projection ID.
  const srid = projection
    .getCode()
    .split(/:(?=\d+$)/)
    .pop();
  return url + "/" + layerId + "/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" + encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' + extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] + ',"spatialReference":{"wkid":' + srid + "}}") + "&geometryType=esriGeometryEnvelope&inSR=" + srid + "&outFields=*" + "&outSR=" + srid;
}

export const selectStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 0, 0.7)",
  }),
  stroke: new Stroke({
    color: "yellow",
    width: 4,
  }),
});

export const customVectorStyles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "red",
      }),
      stroke: new Stroke({ color: "red", width: 1 }),
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "#dc3545", // red
      width: 4,
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
};
