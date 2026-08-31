const BACKEND_ORIGIN = "https://huddle-agonizing-dynamic.ngrok-free.dev";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const backendUrl = new URL(`${url.pathname}${url.search}`, BACKEND_ORIGIN);
      const headers = new Headers(request.headers);
      headers.set("ngrok-skip-browser-warning", "1");
      return fetch(new Request(backendUrl, { ...request, headers }));
    }

    return env.ASSETS.fetch(request);
  },
};
