<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// modules
import { formAlert, initAlert } from "@/modules/alert";
import { encryptData } from "@/modules/encryption";

const router = useRouter();
const isLoadingLogin = ref(false);

const formLogin = reactive({
  email: null,
  password: null,
});

async function getOrganization(data) {
  const { id, role, tokens, username } = data;
  const accessToken = JSON.parse(tokens.replace(/'/g, '"')).access;

  try {
    const response = await axios({
      method: "get",
      url: `https://backend.dev.observer.xyz/organization_users/?user=${id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { results } = response.data;

    const userData = {
      id,
      role,
      accessToken,
      username,
      organization: results[0].organization,
    };

    // save all user data in session storage with encryption
    sessionStorage.setItem("userData", encryptData(JSON.stringify(userData)));
  } catch (error) {
    console.log(error);
  }
}

async function handleLogin() {
  if (formLogin.email === null || formLogin.password === null) {
    initAlert("All Field cannot empty!", "alert-danger");
    return;
  }

  const data = {
    email: formLogin.email,
    password: formLogin.password,
  };

  isLoadingLogin.value = true;
  try {
    const response = await axios.post("https://backend.dev.observer.xyz/auth/login/", data);

    getOrganization(response.data);

    router.push({ path: "map-viewer", query: { project: import.meta.env.VITE_APP_PROJECT_ID, year: import.meta.env.VITE_APP_PROJECT_YEAR } });

    isLoadingLogin.value = false;
  } catch (error) {
    initAlert("Email or Password not correct", "alert-danger");

    formLogin.password = null;
    isLoadingLogin.value = false;
  }
}
</script>

<template>
  <div class="text-center wrapper-login">
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="handleLogin">
        <img class="mb-4" src="/logo.png" alt="" width="72" height="72" />
        <h1 class="h3 mb-3 fw-normal">Pemetaan 360 Kumuh DKI</h1>
        <div v-if="formAlert.isShowAlert" style="padding: 8px 16px" class="text-start alert" :class="formAlert.colorClass" role="alert">{{ formAlert.alertText }}</div>
        <div class="form-floating">
          <input type="email" v-model="formLogin.email" class="form-control" id="email" placeholder="name@example.com" />
          <label for="email">Email address</label>
        </div>
        <div class="form-floating">
          <input type="password" v-model="formLogin.password" class="form-control" id="password" placeholder="Password" />
          <label for="password">Password</label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="isLoadingLogin">
          <span v-if="isLoadingLogin"><i class="fa-solid fa-sync fa-spin"></i></span>
          Login
        </button>
        <p class="mt-5 mb-3 text-muted">© 2023</p>
      </form>
    </main>
  </div>
</template>

<style scoped>
.wrapper-login {
  height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  max-width: 400px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
