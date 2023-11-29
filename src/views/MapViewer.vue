<script setup>
import { Splitpanes, Pane } from "splitpanes";

// components
import PaneMapVue from "@/components/panes/PaneMap.vue";
import PanePanoramaVue from "@/components/panes/PanePanorama.vue";
import PaneTableVue from "@/components/panes/PaneTable.vue";
import CorrectionPopupVue from "@/components/popups/CorrectionPopup.vue";

// modules
import { paneSize } from "@/modules/states";
import { resizeMapAndPanorama, resizeTopAndBottomPane } from "@/modules/resizePane";
import { initMap } from "@/modules/map";
import { initPanorama } from "@/modules/panorama";
import { getLayers } from "@/modules/api";
import { getProject, getYear, timeOut } from "@/modules/var";

function checkValidProjectID() {
  if (import.meta.env.VITE_APP_PROJECT_ID !== getProject()) {
    alert("project id not valid");
  } else if (import.meta.env.VITE_APP_PROJECT_YEAR !== getYear()) {
    alert("year of project not valid");
  }
}

function onReady() {
  setTimeout(() => {
    initMap();
    initPanorama();
    getLayers(getProject(), getYear());
  }, timeOut);

  checkValidProjectID();
}
</script>

<template>
  <div style="height: 100vh">
    <splitpanes horizontal @ready="onReady" class="default-theme" @resize="resizeTopAndBottomPane" :dbl-click-splitter="false">
      <pane :size="paneSize.top">
        <splitpanes vertical @resize="resizeMapAndPanorama" :dbl-click-splitter="false">
          <pane class="card" :size="paneSize.map">
            <PaneMapVue />
          </pane>
          <pane class="card" :size="paneSize.pano">
            <PanePanoramaVue />
          </pane>
        </splitpanes>
      </pane>
      <pane class="card" :size="paneSize.bottom" max-size="50">
        <PaneTableVue />
      </pane>
    </splitpanes>
    <!-- dragable popup -->
    <CorrectionPopupVue />
  </div>
</template>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
