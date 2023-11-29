// modules
import { axiosClient } from "@/modules/axios";
import { decryptData } from "@/modules/encryption";

// modal action button
import AccountVue from "@/components/actionButton/Account.vue";

export let gridApiAccountTable;
const { role } = JSON.parse(decryptData(sessionStorage.getItem("userData")));

export const columnOfAccountTable = [
  { headerName: "Email", field: "email", flex: 1 },
  { headerName: "Username", field: "username", flex: 1 },
  { headerName: "Role", field: "role", flex: 1 },
  {
    headerName: "Status",
    cellRenderer: (params) => {
      return params.data.is_active ? "Active" : "Non Active";
    },
  },
  {
    field: "Options",
    width: 90,
    cellRenderer: AccountVue,
    hide: role === "admin" ? false : true,
  },
];

export const updateAccountData = (data) => gridApiAccountTable.setRowData(data);

export const configAccountTable = {
  resizable: true,
};

export async function getAccounts() {
  const response = await axiosClient.get("/auth/users/");

  const filteredUsers = [];
  for (const item of response.data) {
    let result = await getOrganizationUser(item);
    result !== undefined && filteredUsers.push(result);
  }
  return filteredUsers;
}

async function getOrganizationUser(user) {
  const { organization: organizationId } = JSON.parse(decryptData(sessionStorage.getItem("userData")));

  const response = await axiosClient.get(`/organization_users/`, {
    params: {
      user: user.id,
      organization: organizationId,
    },
  });

  const { results } = response.data;

  if (results.length && organizationId === results[0].organization && user.id === results[0].user) {
    return user;
  }
}

export async function onAccountDataReady(params) {
  try {
    gridApiAccountTable = params.api;
    const accountList = await getAccounts();

    updateAccountData(accountList);
  } catch (error) {
    console.log(error);
  }
}
