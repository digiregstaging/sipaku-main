<script setup>
import { useRouter } from "vue-router";

// modules
import { popupPaneMap } from "@/modules/popup";
import { showAccInfoModal } from "@/modules/modalStates";
import { toggleAccountTable } from "@/modules/states";
import { decryptData } from "@/modules/encryption";

// modals
import AccountInfoVue from "@/modals/AccountInfo.vue";

const router = useRouter();
const { role } = JSON.parse(decryptData(sessionStorage.getItem("userData")));

function handleLogout() {
  sessionStorage.clear();

  // move to login page & reload login page
  router.push("/login");
  router.go();

  // close popup
  popupPaneMap.showAccInfo = false;
}
</script>

<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__zoomOut">
    <div class="acc-info" v-if="popupPaneMap.showAccInfo">
      <div class="card">
        <div class="card-body py-2 px-3">
          <div class="cursor-pointer user fs-6" @click="showAccInfoModal">
            <span>Info Account: {{ role }}</span>
          </div>
          <div class="cursor-pointer user fs-6" @click="toggleAccountTable">
            <span>Account List</span>
          </div>
          <div class="cursor-pointer logout fs-6" @click="handleLogout">
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <AccountInfoVue />
</template>

<style lang="scss" scoped>
.acc-info {
  position: absolute;
  right: 4.5rem;
  bottom: 2.8rem;
  z-index: 10;
  .card-body {
    overflow-y: auto;
  }
}

.user {
  gap: 0.3rem;
  &:hover {
    color: #0d6efd;
  }
}

.logout {
  gap: 0.3rem;
  &:hover {
    color: #fd0d0d;
  }
}
</style>
