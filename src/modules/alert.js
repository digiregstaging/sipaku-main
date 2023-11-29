import { reactive } from "vue";

export const formAlert = reactive({
  isShowAlert: false, // boolean
  alertText: null, // string
  colorClass: "", // bootstrap alert class
});

export function initAlert(text, colorClass) {
  formAlert.isShowAlert = true;
  formAlert.alertText = text;
  formAlert.colorClass = colorClass;
}

export function removeAlert(time) {
  setInterval(() => {
    formAlert.isShowAlert = false;
    formAlert.alertText = null; // string
    formAlert.colorClass = ""; // bootstrap alert class
  }, time);
}
