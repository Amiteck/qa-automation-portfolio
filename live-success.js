(() => {
  const WORKER_BASE = "https://qa-portfolio-fulfillment-live.igor9063.workers.dev";
  const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
  const POLL_INTERVAL_MS = 1500;
  const MAX_ATTEMPTS = 30;

  const status = document.getElementById("fulfillment-status");
  const indicator = document.getElementById("fulfillment-indicator");
  const downloadLink = document.getElementById("download-product");

  function setState(message, state) {
    status.textContent = message;
    indicator.dataset.state = state;
  }

  function readToken() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const fragmentToken = fragment.get("token");

    if (TOKEN_PATTERN.test(fragmentToken ?? "")) {
      sessionStorage.setItem("qaLiveFulfillmentToken", fragmentToken);
      history.replaceState(null, "", window.location.pathname);
      return fragmentToken;
    }

    const storedToken = sessionStorage.getItem("qaLiveFulfillmentToken");
    return TOKEN_PATTERN.test(storedToken ?? "") ? storedToken : null;
  }

  async function checkReady(token) {
    const response = await fetch(
      `${WORKER_BASE}/status?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
      },
    );

    if (!response.ok) {
      throw new Error(`Fulfillment service returned ${response.status}.`);
    }

    return response.json();
  }

  async function waitForFulfillment(token) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const result = await checkReady(token);

        if (result.ready === true) {
          downloadLink.href =
            `${WORKER_BASE}/download?token=${encodeURIComponent(token)}`;
          downloadLink.hidden = false;
          setState("Purchase verified. Your private download is ready.", "ready");
          return;
        }
      } catch (error) {
        if (attempt === MAX_ATTEMPTS) {
          setState(
            error instanceof Error
              ? `Could not verify fulfillment: ${error.message}`
              : "Could not verify fulfillment.",
            "error",
          );
          return;
        }
      }

      setState(
        `Waiting for the signed Paddle Live webhook… (${attempt}/${MAX_ATTEMPTS})`,
        "waiting",
      );

      await new Promise((resolve) =>
        window.setTimeout(resolve, POLL_INTERVAL_MS),
      );
    }

    setState(
      "The webhook has not arrived yet. Refresh this page in a few seconds or check the Paddle notification log.",
      "error",
    );
  }

  const token = readToken();

  if (!token) {
    setState(
      "No fulfillment token was found. Start a new live purchase from the private live checkout page.",
      "error",
    );
    return;
  }

  waitForFulfillment(token);
})();
