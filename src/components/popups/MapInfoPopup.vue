<script setup>
import { ref } from "vue";

// modules
import { popupPaneMap, toggleMapInfo } from "@/modules/popup";
import { featuresData } from "@/modules/map";

const closeBtn = ref(false);
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeInLeft animate__faster" leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
    <div class="card" v-if="popupPaneMap.showMapInfo">
      <div class="card-title">
        <div class="close-btn cursor-pointer" @mouseover="closeBtn = true" @mouseleave="closeBtn = false" @click="toggleMapInfo">
          <i class="fa-circle-xmark fa-lg" :class="closeBtn ? 'fa-solid' : 'fa-regular'"></i>
        </div>
      </div>
      <div class="card-body">
        <table class="table" v-if="featuresData">
          <tbody>
            <tr v-for="(value, propertyName) in featuresData">
              <th scope="row" style="font-size: 0.8rem">{{ propertyName }}</th>
              <td style="font-size: 0.8rem">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.card {
  position: absolute;
  left: 0.2rem;
  bottom: 2.8rem;
  z-index: 10;
  min-width: 14rem;
  height: 87%;
  overflow-y: auto;
  .close-btn {
    position: absolute;
    top: 0.2rem;
    right: 0.3rem;
  }
}
</style>
