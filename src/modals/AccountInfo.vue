<script setup>
import { onMounted, reactive } from "vue";

// modules
import { axiosClient } from "@/modules/axios";
import { decryptData } from "@/modules/encryption";

const userDetail = reactive({
  id: "",
  email: "",
  username: "",
  role: "",
});

async function getUser() {
  const { id: userId } = JSON.parse(decryptData(sessionStorage.getItem("userData")));

  const response = await axiosClient.get(`/auth/users/${userId}/`);
  const { id, email, username, role } = response.data;
  userDetail.id = id;
  userDetail.email = email;
  userDetail.username = username;
  userDetail.role = role;
}

onMounted(() => {
  getUser();
});
</script>

<template>
  <div class="modal fade" id="acc-info-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Account Information</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ol class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">User ID</div>
                {{ userDetail.id }}
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">Email</div>
                {{ userDetail.email }}
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">Username</div>
                {{ userDetail.username }}
              </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">Role</div>
                {{ userDetail.role }}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
