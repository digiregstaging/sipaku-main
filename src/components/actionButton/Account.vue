<script setup>
import Swal from "sweetalert2";

// modules
import { axiosClient } from "@/modules/axios";
import { gridApiAccountTable, updateAccountData, getAccounts } from "@/modules/tables/account";
import { Toast } from "@/modules/var";

// modules
import { showAcc2InfoModal } from "@/modules/modalStates";

async function deleteAccount(data) {
  const { id } = data;
  Swal.fire({
    title: "Are you sure?",
    text: "This account could't be able to restore!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0d6efd",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/auth/users/${id}/`);

        gridApiAccountTable && gridApiAccountTable.showLoadingOverlay();

        // refetch with new data
        const accountList = await getAccounts();
        updateAccountData(accountList);

        gridApiAccountTable && gridApiAccountTable.hideOverlay();

        Toast.fire({
          icon: "success",
          title: "Account Deleted!",
        });
      } catch (error) {
        console.error(error);

        Toast.fire({
          icon: "error",
          title: "Failed to Remove Account!",
        });
      }
    }
  });
}
</script>

<template>
  <div class="d-flex gap-2">
    <span @click="() => showAcc2InfoModal(params.data)"><i class="fa-solid fa-circle-info cursor-pointer"></i></span>
    <span @click="() => deleteAccount(params.data)"><i class="fa-solid fa-trash cursor-pointer"></i></span>
  </div>
</template>
