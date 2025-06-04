import { fetchWithAuth } from "../fetchInstances/fetchInstances";

import { accessTokenKey, userKey } from "../constants/storageConstants";

export const authService = {
    setToken: (token: string) => {
        localStorage.setItem(accessTokenKey, token);
    },

    getToken: () => {
        return localStorage.getItem(accessTokenKey);
    },
    
    refreshToken: async () => {
        const response = await fetchWithAuth("/auth/refresh", {
            method: "POST",
        });

        return response;
    },

    test: async () => {
        const response = await fetchWithAuth("/auth/test", {
            method: "GET",
            cache: "force-cache",
        });

        return response;
    }
}