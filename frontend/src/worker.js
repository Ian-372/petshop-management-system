const BACKEND_ORIGIN = "https://huddle-agonizing-dynamic.ngrok-free.dev";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const backendUrl = new URL(`${url.pathname}${url.search}`, BACKEND_ORIGIN);
      const headers = new Headers(request.headers);
      headers.set("ngrok-skip-browser-warning", "1");
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
