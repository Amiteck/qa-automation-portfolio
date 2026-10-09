(() => {
  const script = document.createElement("script");

  script.type = "module";
  script.src =
    "https://static.cloudflareinsights.com/beacon.min.js";

  script.setAttribute(
    "data-cf-beacon",
    JSON.stringify({
      token: "fec3865376414a7fbfd991b19797ff62",
    }),
  );

  document.head.appendChild(script);
})();
