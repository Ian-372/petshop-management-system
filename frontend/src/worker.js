const BACKEND_ORIGIN = "https://petshop-management-system-production.up.railway.app";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const backendUrl = new URL(`${url.pathname}${url.search}`, BACKEND_ORIGIN);
      const headers = new Headers(request.headers);
      return fetch(backendUrl, {
        method: request.method,
        headers,
        body: request.body,
        redirect: "manual",
      });
    }

    return env.ASSETS.fetch(request);
  },
};
