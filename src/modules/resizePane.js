import { resizeMap } from "@/modules/map";
import { renderResizePanorama } from "@/modules/panorama";
import { paneSize } from "@/modules/states";
import { timeOut } from "@/modules/var";

export function showPanePanorama() {
  paneSize.map = 50;
  paneSize.pano = 50;
  setTimeout(() => resizeMap(), timeOut);
}

export function hidePanePanorama() {
  paneSize.map = 100;
  paneSize.pano = 0;
  setTimeout(() => resizeMap(), timeOut);
}

export function resizeMapAndPanorama(event) {
  paneSize.map = event[0].size;
  paneSize.pano = event[1].size;
  resizeMap();
  renderResizePanorama();
}

export function resizeTopAndBottomPane(event) {
  paneSize.top = event[0].size;
  paneSize.bottom = event[1].size;
  resizeMap();
  renderResizePanorama();
}

export function openAttributeTable() {
  paneSize.top = 50;
  paneSize.bottom = 50;
  setTimeout(() => {
    resizeMap();
    renderResizePanorama();
  }, timeOut);
}

export function closeAttributeTable() {
  paneSize.top = 100;
  paneSize.bottom = 0;
  setTimeout(() => {
    resizeMap();
    renderResizePanorama();
  }, timeOut);
}
