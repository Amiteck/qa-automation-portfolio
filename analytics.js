(() => {
  const TOKEN = "fec3865376414a7fbfd991b19797ff62";

  if (
    !TOKEN ||
    TOKEN === "fec3865376414a7fbfd991b19797ff62"
  ) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src =
    "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute(
    "data-cf-beacon",
    JSON.stringify({
      token: TOKEN,
    }),
  );

  document.head.appendChild(script);
})();
