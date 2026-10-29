const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!configuredBaseUrl) {
  throw new Error(
    "Missing VITE_API_BASE_URL. Set it in your local .env.local file.",
  );
}

const BASE_URL = configuredBaseUrl.replace(/\/$/, "");

async function request(path, { method = "GET", params, body } = {}) {
  const url = new URL(`${BASE_URL}/${path.replace(/^\//, "")}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      url.searchParams.set(key, value);
  });
  let response;
  try {
    response = await fetch(url, {
      method,
      headers:
        body === undefined
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error(
      "Could not connect to the API. Check your connection and try again.",
    );
  }
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!response.ok)
    throw new Error(data?.message || `Request failed (${response.status}).`);
  return data;
}

export const api = {
  addBloodBank: (body) => request("/add-blood-bank", { method: "POST", body }),
  getBankRequests: (bankId) =>
    request("/bank-requests", { params: { bankId } }),
  getBloodBanks: () => request("/blood-banks"),
  createBloodRequest: (body) =>
    request("/create-request", { method: "POST", body }),
  deleteBloodBank: (bankId) =>
    request("/delete-blood-bank", { method: "DELETE", params: { bankId } }),
  manageBloodRequest: (body) =>
    request("/manage-request", { method: "PATCH", body }),
  searchBlood: (params) => request("/search-blood", { params }),
  trackBloodRequest: (requestId) =>
    request("/track-request", { params: { requestId } }),
  updateInventory: (body) =>
    request("/update-inventory", { method: "PUT", body }),
};

export const apiBaseUrl = BASE_URL;
