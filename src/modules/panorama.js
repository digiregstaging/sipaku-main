import { reactive, ref } from "vue";
import * as THREE from "three";
import proj4 from "proj4";

import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";
import GeoJSON from "ol/format/GeoJSON";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { transform } from "ol/proj";

// modules
import { axiosClient, axiosBasicAuth } from "@/modules/axios";
import { getProject, getYear, format, getDistanceFromLatLonInMetres } from "@/modules/var";
import { featuresPanorama, containerMap } from "@/modules/map";
import { isLoadingMap, isLoadingPanorama, isPanoramaMeasurementOn } from "@/modules/states";
import { hidePopupPanePanorama } from "@/modules/popup";

export let camera, scene, renderer;
let geometry, material, mesh;
export let container;
export let otherPanosGroup = null;
let horizon = null;
let spotProto = null;
let spotProtoMeasurement = null;
let otherPanosMaterial = null;
let otherPanosSelectedMaterial = null;
let locationSpot1 = null;
let locationSpot2 = null;
let locationx = null;
export let planeSurf = null;
export let raycaster = null;
export let mouse = null;
let panoLink = null;
let widthPanel = 0;
let heightPanel = 0;
export let panoramaData;
export let spotGroup = null;
export let panoTagsGroup, contextGroup;
let spotGroupMeasurement;
export let gridGeometry, gridMaterial, gridMesh;
export let heading, panoNote, panoTrack, filename, panoKey, panoLat, panoLon, utmCode, utmSrid, utmX, utmY, creator;
let pitch, roll, heightFromGround, heightFromGroundReset, rollReset, trackReset;
export const coordinates = reactive({
  lat: 0,
  lon: 0,
});
let lat = coordinates.lat;
let lon = coordinates.lon;
let isUserInteracting = false;
let onMouseDownMouseX = 0;
let onMouseDownMouseY = 0;
let onMouseDownLon = 0;
let onMouseDownLat = 0;
let panoX, panoY;
let cursorX = 0;
let cursorY = 0;
let panoUtmCode, panoUtmSrid;
let utmProj = "";
let selectedLink;
export const lonlat = ref(null);
let arrSpotMeasurement = 0;
let spotMeasurement = [];
let point = [];
let line = null;
export const resultOfMeasureDistance = ref(null);

const getFov = () => {
  return Math.floor((2 * Math.atan(camera.getFilmHeight() / 2 / camera.getFocalLength()) * 180) / Math.PI);
};

const clickZoom = (value, zoomType) => {
  if (value >= 20 && zoomType === "zoomIn") {
    return value - 5;
  } else if (value <= 75 && zoomType === "zoomOut") {
    return value + 5;
  } else {
    return value;
  }
};

export const zoomInPanorama = (e) => {
  const fov = getFov();
  camera.fov = clickZoom(fov, "zoomIn");
  camera.updateProjectionMatrix();
};

export const zoomOutPanorama = (e) => {
  const fov = getFov();
  camera.fov = clickZoom(fov, "zoomOut");
  camera.updateProjectionMatrix();
};

export const correctionData = reactive({
  id: "",
  yField: 0,
  xField: 0,
  hField: 0,
  rollField: 0,
  pitchField: 0,
  trackField: 0,
  noteField: "",
});

export const defaultCorrectionData = reactive({
  yField: 0,
  xField: 0,
  hField: 0,
  rollField: 0,
  pitchField: 0,
  trackField: 0,
  noteField: "",
});

export function fixChanged() {
  let correction = {
    dx: correctionData.xField,
    dy: correctionData.yField,
    dh: correctionData.hField,
    dr: correctionData.rollField,
    dp: correctionData.pitchField,
    dt: correctionData.trackField,
  };
  viewFixPanorama(correction);
}

export function setCorrection(correction) {
  const { id, drift_x, drift_y, height, roll, pitch, track } = correction;

  correctionData.id = id;
  correctionData.yField = parseFloat(drift_y);
  correctionData.xField = parseFloat(drift_x);
  correctionData.hField = parseFloat(height);
  correctionData.rollField = parseFloat(roll);
  correctionData.pitchField = parseFloat(pitch);
  correctionData.trackField = parseFloat(track);
  correctionData.noteField = "";

  defaultCorrectionData.yField = parseFloat(drift_y);
  defaultCorrectionData.xField = parseFloat(drift_x);
  defaultCorrectionData.hField = parseFloat(height);
  defaultCorrectionData.rollField = parseFloat(roll);
  defaultCorrectionData.pitchField = parseFloat(pitch);
  defaultCorrectionData.trackField = parseFloat(track);
  defaultCorrectionData.noteField = "";

  fixChanged();
}

export function viewFixPanorama(correction) {
  const { dx, dy, dh, dr, dp, dt } = correction;

  camera.position.set(dy, dh - heightFromGround, dx);
  mesh.rotation.x = (Math.PI * dr) / 180;
  mesh.rotation.z = (Math.PI * dp) / 180;
  panoTrack = dt;
  otherPanosGroup.rotation.y = (Math.PI * panoTrack) / 180;
  spotGroup.rotation.y = (Math.PI * panoTrack) / 180;
  panoTagsGroup.rotation.y = (Math.PI * panoTrack) / 180;
  contextGroup.rotation.y = (Math.PI * panoTrack) / 180;
}

export async function initPanorama() {
  widthPanel = document.querySelector("#wrapper-panorama").offsetWidth;
  heightPanel = document.querySelector("#wrapper-panorama").offsetHeight;
  container = document.querySelector("#wrapper-panorama");
  otherPanosGroup = new THREE.Object3D();

  let horizonGeometry = new THREE.EdgesGeometry(new THREE.CircleGeometry(450, 50));
  let horizonMaterial = new THREE.LineDashedMaterial({
    color: "orange",
    linewidth: 1,
    scale: 1,
    dashSize: 5,
    gapSize: 5,
  });

  horizon = new THREE.LineLoop(horizonGeometry, horizonMaterial);
  horizon.computeLineDistances();
  horizon.rotation.x = -Math.PI / 2;
  horizon.rotation.y = Math.PI;

  const spotGeometry1 = new THREE.CircleGeometry(0.3, 16);
  const spotGeometry2 = new THREE.CircleGeometry(0.1, 16);
  const spotMaterial = new THREE.MeshBasicMaterial({
    color: "green",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });

  const spotObj1 = new THREE.Mesh(spotGeometry1, spotMaterial);
  spotObj1.rotation.x = -Math.PI / 2;

  const spotObj2 = new THREE.Mesh(spotGeometry2, spotMaterial);
  spotObj2.position.set(0, 0.01, 0);
  spotObj2.rotation.x = -Math.PI / 2;

  spotProto = new THREE.Object3D();
  spotProto.add(spotObj1, spotObj2);
  spotProto.position.set(1000, 1000, 1000);

  const spotGeometryMeasurement1 = new THREE.CircleGeometry(0.3, 16);
  const spotGeometryMeasurement2 = new THREE.CircleGeometry(0.1, 16);
  const spotMaterialMeasurement = new THREE.MeshBasicMaterial({
    color: "orange",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });

  const spotObjMeasurement1 = new THREE.Mesh(spotGeometryMeasurement1, spotMaterialMeasurement);
  spotObjMeasurement1.rotation.x = -Math.PI / 2;

  const spotObjMeasurement2 = new THREE.Mesh(spotGeometryMeasurement2, spotMaterialMeasurement);
  spotObjMeasurement2.position.set(0, 0.01, 0);
  spotObjMeasurement2.rotation.x = -Math.PI / 2;

  spotProtoMeasurement = new THREE.Object3D();
  spotProtoMeasurement.add(spotObjMeasurement1, spotObjMeasurement2);
  // spotProtoMeasurement.position.set(1000, 1000, 1000);

  otherPanosMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0ff20,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });

  otherPanosSelectedMaterial = new THREE.MeshBasicMaterial({
    color: "yellow",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });

  const locationGeometry = new THREE.CircleGeometry(1.5, 32);
  const locationMaterial = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

  locationSpot1 = new THREE.Mesh(locationGeometry, locationMaterial);
  locationSpot1.rotation.x = -Math.PI / 2;

  locationSpot2 = new THREE.Mesh(new THREE.CircleGeometry(0.8, 32), locationMaterial);
  locationSpot2.position.set(0, 0.01, 0);
  locationSpot2.rotation.x = -Math.PI / 2;

  let linesGeometry = [];
  const locationLineGeometry = new THREE.BufferGeometry();
  const locationLineMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    linewidth: 4,
    scale: 1,
    dashSize: 0.1,
    gapSize: 0.1,
  });

  linesGeometry.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1000, 0));
  locationLineGeometry.setFromPoints(linesGeometry);

  const locationLine = new THREE.Line(locationLineGeometry, locationLineMaterial);
  locationLine.computeLineDistances();

  locationx = new THREE.Object3D();
  locationx.add(locationSpot1, locationSpot2, locationLine);
  locationx.position.set(1000, 1000, 1000);

  const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff00f,
    transparent: true,
    visible: false,
    side: THREE.DoubleSide,
    opacity: 0.1,
  });

  planeSurf = new THREE.Mesh(planeGeometry, planeMaterial);
  planeSurf.rotation.x = -Math.PI / 2;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const panoLinkGeometry = new THREE.CircleGeometry(1.5, 60);
  const panoLinkMaterial = new THREE.LineBasicMaterial({
    color: "yellow",
    linewidth: 2,
  });

  panoLink = new THREE.Line(panoLinkGeometry, panoLinkMaterial);
  panoLink.rotation.x = -Math.PI / 2;

  loadPanorama(await initialPanorama());
}

async function initialPanorama() {
  const response = await axiosClient.get(`/panoramas/?p=1&page_size=1&project=${getProject()}&year=${getYear()}`);
  const { results } = response.data;

  return results[0].id;
}

export async function loadPanorama(pano_key, firstInitMap = true, firstInitPanorama = true) {
  if (firstInitMap) {
    isLoadingMap.value = true;
  }
  if (firstInitPanorama) {
    isLoadingPanorama.value = true;
  }

  camera = new THREE.PerspectiveCamera(50, widthPanel / heightPanel, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  scene = new THREE.Scene();
  geometry = new THREE.SphereGeometry(500, 25, 25);
  geometry.scale(-1, 1, 1);
  await getPanoramaDetails(pano_key);
}

async function getCorrection(data) {
  const { id } = data;
  const response = await axiosBasicAuth.get("/api/correct", {
    params: {
      base_id: id,
    },
  });
  setCorrection(response.data[0]);
}

async function getPanoramaDetails(pano_key) {
  const response = await axiosClient.get(`/panoramas/${pano_key}/?format=json`);
  panoramaData = response.data;
  featuresPanorama.value = panoramaData;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    panoramaData.pot_hole_image ? panoramaData.pot_hole_image : panoramaData.eqimage,
    function (texture) {
      applyEqimageMapping(texture);
      THREE.Cache.enabled = true;
    },
    function (err) {
      loadPanorama(initialPanorama());
    }
  );

  textureLoader.crossOrigin = "";
}

function applyEqimageMapping(mapping) {
  if (material) {
    material.dispose();
  }

  material = new THREE.MeshBasicMaterial({
    map: mapping,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh, planeSurf, locationx, horizon);

  panoTagsGroup = new THREE.Group();
  scene.add(panoTagsGroup);

  contextGroup = new THREE.Group();
  scene.add(contextGroup);

  spotGroup = new THREE.Group();
  scene.add(spotGroup);
  // spotGroup.add(spotProto);
  spotProto.position.set(5, 5, -2);

  spotGroupMeasurement = new THREE.Group();
  scene.add(spotGroupMeasurement);
  // spotGroupMeasurement.add(spotProtoMeasurement);
  spotProtoMeasurement.position.set(5, 5, -2);

  gridGeometry = new THREE.SphereGeometry(450, 40, 20);
  gridMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffff00),
    visible: false,
    side: THREE.DoubleSide,
  });

  gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
  scene.add(gridMesh);

  if (renderer == undefined) {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(widthPanel, heightPanel);
    container.appendChild(renderer.domElement);
  }

  heading = 0;
  panoNote = panoramaData.note;
  filename = panoramaData.base_name;
  panoKey = panoramaData.id;
  panoLat = panoramaData.lat;
  panoLon = panoramaData.lon;
  utmCode = panoramaData.utm_code;
  utmSrid = panoramaData.utm_srid;
  utmX = panoramaData.utm_x;
  utmY = panoramaData.utm_y;
  creator = panoramaData.creator_name;

  if (panoramaData.pitch) {
    pitch = panoramaData.pitch;
  } else {
    pitch = 0;
  }

  if (panoramaData.roll) {
    roll = panoramaData.roll;
  } else {
    roll = 0;
  }

  mesh.rotation.y = Math.PI;
  mesh.rotation.z = (Math.PI * pitch) / 180;
  mesh.rotation.x = (Math.PI * roll) / 180;

  if (panoramaData.height_from_ground) {
    heightFromGround = panoramaData.height_from_ground;
  } else {
    heightFromGround = 2;
  }

  planeSurf.position.y = -heightFromGround;

  panoTrack = heading;

  heightFromGroundReset = heightFromGround;
  rollReset = roll;
  trackReset = panoTrack;

  updateLocation(panoKey, panoLon, panoLat, utmX, utmY, utmCode, utmSrid, heightFromGroundReset, heading, roll, pitch, panoNote, creator);
  restoreOtherPanos();
  enableNavigation(true);
  render();
  getCorrection(panoramaData);

  isLoadingMap.value = false;
  isLoadingPanorama.value = false;
}

function updateLocation(pano_key, lon, lat, utm_x, utm_y, utm_code, utm_srid, height, heading, roll, pitch, note, creator) {
  panoKey = pano_key;
  panoX = utm_x;
  panoY = utm_y;
  panoLon = lon;
  panoLat = lat;
  panoUtmCode = utm_code;
  panoUtmSrid = utm_srid;

  setUtmProj(utm_code);
  setView(lon, lat);
  icon.setGeometry(new Point(transform([lon, lat], "EPSG:4326", "EPSG:3857")));
}

function setUtmProj(utm_code) {
  let utm_zone = utm_code.slice(0, -1);
  const utm_suffix = utm_code.slice(-1);
  if (!"NPQRSTUVZXY".includes(utm_suffix)) {
    utm_zone += "+south";
  }
  utmProj = "+proj=utm +zone=%z +datum=WGS84 +units=m +no_defs".replace("%z", utm_zone); // + ("N" == utm_or ? "" : "+south"))
}

function setView(lon, lat) {
  containerMap.removeLayer(markerVector);
  containerMap.getView().setCenter(transform([lon, lat], "EPSG:4326", "EPSG:3857"));
  containerMap.addLayer(markerVector);
  markerVector.setZIndex(1000);
}

function createStyle(feature) {
  let pathIcon = "";
  const coordsx = feature.getGeometry().getCoordinates();

  if (coordsx[0] == 0 && coordsx[1] == 0) {
    pathIcon = "/null.png";
  } else {
    pathIcon = "/pointer/viewpoint_dx.png";
  }

  return new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      rotateWithView: true,
      rotation: feature.get("rotation"),
      src: pathIcon,
    }),
  });
}

const cursor = new Feature({
  geometry: new Point([0, 0]),
  name: "cursor",
  rotation: 0,
});

const icon = new Feature({
  geometry: new Point([0, 0]),
  name: "pano",
  rotation: 0,
});

const markerVector = new VectorLayer({
  source: new VectorSource({
    features: [icon],
    projection: "EPSG:4326",
  }),
  style: createStyle,
});

let render = function () {
  requestAnimationFrame(render);
  update();
};

let update = function () {
  lat = Math.max(-85, Math.min(85, lat));
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);

  camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
  camera.target.y = 500 * Math.cos(phi);
  camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(camera.target);
  renderer.render(scene, camera);
};

export function renderResizePanorama() {
  let widthPanel = document.getElementById("wrapper-panorama").offsetWidth;
  let heightPanel = document.getElementById("wrapper-panorama").offsetHeight;

  if (renderer) {
    renderer.setSize(widthPanel, heightPanel);
  }

  camera.aspect = widthPanel / heightPanel;
  camera.updateProjectionMatrix();
}

function onDocumentMouseDown(event) {
  hidePopupPanePanorama();
  event.preventDefault();
  isUserInteracting = true;
  onMouseDownMouseX = event.clientX;
  onMouseDownMouseY = event.clientY;
  onMouseDownLon = lon;
  onMouseDownLat = lat;
  update();
}

function onDocumentMouseMove(event) {
  if (isUserInteracting === true) {
    lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon;
    lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
    emitViewChanged();
  } else {
    if (renderer) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const other_panos_intersect = raycaster.intersectObject(otherPanosGroup, true);

      if (other_panos_intersect[0]) {
        showCursor(false);
        selectedLink = other_panos_intersect[0].object;
        selectedLink.material = otherPanosSelectedMaterial;
      } else {
        showCursor(true);
        try {
          selectedLink.material = otherPanosMaterial;
        } catch (e) {}
      }

      const plane_intersect = raycaster.intersectObject(planeSurf);

      if (plane_intersect[0]) {
        const back_rotation = (-Math.PI * panoTrack) / 180;
        const back_x = plane_intersect[0].point.z * Math.cos(back_rotation) - plane_intersect[0].point.x * Math.sin(back_rotation);
        const back_y = plane_intersect[0].point.x * Math.cos(back_rotation) + plane_intersect[0].point.z * Math.sin(back_rotation);

        cursorPano(back_x, back_y);
        locationx.position.set(plane_intersect[0].point.x, plane_intersect[0].point.y + 0.1, plane_intersect[0].point.z);
      }
    }
  }
}

function onDocumentMouseUp(event) {
  isUserInteracting = false;
}

function onDocumentDblclick(event) {
  if (isPanoramaMeasurementOn.value) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(gridMesh);
    const plane_intersect = raycaster.intersectObject(planeSurf);
    let lat_click = 180 * intersect[0].uv.y - 90;
    let lon_click = -(360 * intersect[0].uv.x - panoTrack);

    if (lon_click < 0) {
      lon_click = 360 + lon_click;
    }

    // enableNavigation(false);
    containerMap.removeLayer(spotLayerMeasurement);
    storeTempMapMeasurement(lon_click, lat_click, plane_intersect[0].point.x, plane_intersect[0].point.y, plane_intersect[0].point.z, intersect);
    containerMap.addLayer(spotLayerMeasurement);
  }
}

function onDocumentMouseWheel(event) {
  const fov = camera.fov + event.deltaY / 50;
  camera.fov = THREE.MathUtils.clamp(fov, 5, 75);
  camera.updateProjectionMatrix();
}

function onDocumentClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObjects([otherPanosGroup, spotGroup], true);

  if (intersect[0]) {
    if (intersect[0].object.ws_type == "other pano") {
      panoKey = intersect[0].object.ws_pano_key;
      loadPanorama(panoKey, false);
    }
  }
}

export function enableNavigation(bool) {
  if (bool) {
    container.addEventListener("mousedown", onDocumentMouseDown, false);
    container.addEventListener("mousemove", onDocumentMouseMove, false);
    container.addEventListener("dblclick", onDocumentDblclick, false);
    container.addEventListener("click", onDocumentClick, false);
    container.addEventListener("wheel", onDocumentMouseWheel, false);
    document.addEventListener("mouseup", onDocumentMouseUp, false);
  } else {
    container.removeEventListener("mousedown", onDocumentMouseDown, false);
    container.removeEventListener("mousemove", onDocumentMouseMove, false);
    container.removeEventListener("dblclick", onDocumentDblclick, false);
    container.removeEventListener("click", onDocumentClick, false);
    container.removeEventListener("wheel", onDocumentMouseWheel, false);
    document.removeEventListener("mouseup", onDocumentMouseUp, false);
  }
}

function showCursor(isVisible) {
  locationx.traverse(function (child) {
    child.visible = isVisible;
  });
}

function cursorPano(dx, dy) {
  cursorX = panoX + dx;
  cursorY = panoY + dy;
  cursor.setGeometry(new Point(proj4(utmProj, "EPSG:3857", [cursorX, cursorY])));
}

function rotatePano(rotate) {
  icon.set("rotation", (rotate * Math.PI) / 180);
}

function emitViewChanged() {
  let center_view = new THREE.Vector2();
  center_view.x = 0;
  center_view.y = 0;
  raycaster.setFromCamera(center_view, camera);

  let intersect = raycaster.intersectObject(gridMesh);
  let rotation = -(360 * intersect[0].uv.x - panoTrack);

  if (rotation < 0) {
    rotation = 360 + rotation;
  }

  rotation = rotation - 180;
  rotatePano(rotation);
  icon.changed();
}

function restoreOtherPanos() {
  const filters = format(`?project=${getProject()}&year=${getYear()}&dist=25&point=%%,%%`, panoLon, panoLat);
  otherPanosLoaded(filters);
}

async function otherPanosLoaded(filters = "") {
  const response = await axiosClient.get(`/panoramas/${filters}`);
  const other_panos_data = response.data;

  const otherPanosMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0ff20,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });

  scene.remove(otherPanosGroup);
  otherPanosGroup = new THREE.Object3D();

  for (var i = 0; i < other_panos_data.count; i++) {
    const item = other_panos_data["results"][i];
    if (item) {
      let op_geometry = new THREE.CircleGeometry(1, 32);
      let op_location = new THREE.Mesh(op_geometry, otherPanosMaterial);
      op_location.rotation.x = -Math.PI / 2;
      op_location.position.set(-(utmY - item.utm_y), -heightFromGround, -(utmX - item.utm_x));
      op_location.ws_type = "other pano";
      op_location.ws_pano_key = item.id;
      otherPanosGroup.add(op_location);
    }
  }

  otherPanosGroup.rotation.y = (Math.PI * panoTrack) / 180;
  scene.add(otherPanosGroup);
}

let storeTempMapMeasurement = function (img_lon, img_lat, spot_x, spot_y, spot_z, intersect) {
  const spotLocation_wgs84 = proj4(utmProj, "EPSG:4326").forward([cursorX, cursorY]);

  if (spotMeasurement.length > 1) {
    for (var i = spotMeasurement.length; i > 0; i--) {
      spotMeasurement.pop();
    }
  }

  if (point.length > 1) {
    for (var i = point.length; i > 0; i--) {
      point.pop();
    }
  }

  scene.remove(line);

  spotMeasurement.push(
    JSON.parse(
      JSON.stringify({
        panorama: panoKey,
        type: 2,
        img_lon: img_lon,
        img_lat: img_lat,
        lon: spotLocation_wgs84[0],
        lat: spotLocation_wgs84[1],
        utm_x: cursorX,
        utm_y: cursorY,
        utm_code: utmCode,
        utm_srid: utmSrid,
      })
    )
  );

  restoreSpotMeasurement();
};

let restoreSpotMeasurement = function (bool = true) {
  removeImgObjMeasurement();
  if (bool) {
    restoreImgObjMeasurement();
  }
};

let restoreImgObjMeasurement = function () {
  let objMeasurements = new Object();
  let featuresMeasurement = new Array();

  spotMeasurement.forEach(function (item) {
    let newTagObjectMeasurement;
    let geometryMeasurement = new Object();

    newTagObjectMeasurement = spotProtoMeasurement.clone();
    newTagObjectMeasurement.position.set(item["utm_y"] - utmY, -heightFromGround, item["utm_x"] - utmX);
    newTagObjectMeasurement.children[0].ws_type = "measurement";
    newTagObjectMeasurement.children[0].ws_imgObjKey = item.id;
    newTagObjectMeasurement.children[1].ws_type = "measurement";
    newTagObjectMeasurement.children[1].ws_imgObjKey = item.id;

    spotGroupMeasurement.add(newTagObjectMeasurement);
    scene.add(spotGroupMeasurement);

    geometryMeasurement.type = "Point";
    geometryMeasurement.coordinates = new Array(item["lon"], item["lat"]);
    featuresMeasurement.push(geometryMeasurement);
  });

  if (spotGroupMeasurement.children.length === 2) {
    point.push(spotGroupMeasurement.children[0].position);
    point.push(spotGroupMeasurement.children[1].position);
    const geometry = new THREE.BufferGeometry().setFromPoints(point);
    line = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 10,
      })
    );
    scene.add(line);
  }

  objMeasurements.type = "FeatureCollection";
  objMeasurements.features = featuresMeasurement;

  mapSpotsLoadedMeasurement(objMeasurements);
};

export let spotLayerMeasurement = new VectorLayer({
  title: "Measurement",
  visible: true,
  source: new VectorSource({
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.3)",
    }),
    image: new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: "/pointer/sprites/point9.png",
    }),
  }),
});

export const removeSpotMeasurement = function () {
  if (spotMeasurement.length > 1) {
    for (var i = spotMeasurement.length; i > 0; i--) {
      spotMeasurement.pop();
    }
  }

  restoreSpotMeasurement();
};

let mapSpotsLoadedMeasurement = function (spotMeasurement, intersect) {
  const features = new GeoJSON().readFeatures(spotMeasurement, {
    featureProjection: "EPSG:3857",
  });

  if (spotMeasurement.features.length == 2) {
    let arrMesurement = [];
    let lonArr = [];
    let latArr = [];

    arrMesurement = spotMeasurement.features;
    arrMesurement.forEach(function (item, index) {
      for (let i = 0; i <= 1; i++) {
        if (i == 0) {
          lonArr.push(item.coordinates[0]);
        } else {
          latArr.push(item.coordinates[1]);
        }
      }
    });

    let measureDistance = getDistanceFromLatLonInMetres(latArr[0], lonArr[0], latArr[1], lonArr[1]);
    resultOfMeasureDistance.value = measureDistance.toFixed(2);

    // show box distance
    const boxDistance = new bootstrap.Toast(document.getElementById("distance"), {});
    boxDistance.show();
  }

  const spotSourceMeasurement = new VectorSource({
    features: features,
    format: new GeoJSON(),
  });

  spotLayerMeasurement.setSource(spotSourceMeasurement);
};

export const removeImgObjMeasurement = function () {
  for (let i = spotGroupMeasurement.children.length - 1; i >= 0; i--) {
    spotGroupMeasurement.remove(spotGroupMeasurement.children[i]);
  }

  if (arrSpotMeasurement > 1) {
    let originalLength = spotMeasurement.length;
    for (var i = originalLength; i > 0; i--) {
      spotMeasurement.pop();
    }
  }
  scene.remove(spotGroupMeasurement);
  scene.remove(line);
};
