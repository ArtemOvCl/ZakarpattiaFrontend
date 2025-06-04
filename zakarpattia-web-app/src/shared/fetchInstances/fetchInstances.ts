import { createFetch } from "../libs/customFetch";
import { API_URL } from "../constants/apiConstants";
import { accessTokenKey } from "../constants/storageConstants";

import { authService } from "../services/authService";

async function handleUnauthorized() {
  const response = await authService.refreshToken();

  if (response.ok) {
    const data = await response.json();
    authService.setToken(data.access_token);
  } else {
    window.location.href = "/login";
  }
}

export const fetchWithAuth = createFetch({
  baseUrl: API_URL!,
  tokenPath: accessTokenKey,
  onUnauthorized: handleUnauthorized,
});
