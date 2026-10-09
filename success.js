(() => {
  const config = window.QA_PADDLE;
  const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
  const POLL_INTERVAL_MS = 1500;
  const MAX_ATTEMPTS = 40;

  const status = document.getElementById("fulfillment-status");
  const indicator = document.getElementById("fulfillment-indicator");
  const downloadLink = document.getElementById("download-product");

  function setState(message, state) {
    status.textContent = message;
    indicator.dataset.state = state;
  }

  function readToken() {
    const fragment = new URLSearchParams(
      window.location.hash.slice(1),
    );

    const fragmentToken = fragment.get("token");

    if (TOKEN_PATTERN.test(fragmentToken ?? "")) {
      sessionStorage.setItem(
        "qaFulfillmentToken",
        fragmentToken,
      );

      history.replaceState(
        null,
        "",
        window.location.pathname,
      );

      return fragmentToken;
    }

    const storedToken =
      sessionStorage.getItem("qaFulfillmentToken");

    return TOKEN_PATTERN.test(storedToken ?? "")
      ? storedToken
      : null;
  }

  async function checkReady(token) {
    const response = await fetch(
      `${config.workerBase}/status?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Fulfillment service returned ${response.status}.`,
      );
    }

    return response.json();
  }

  async function waitForFulfillment(token) {
    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt += 1
    ) {
      try {
        const result = await checkReady(token);

        if (result.ready === true) {
          downloadLink.href =
            `${config.workerBase}/download?token=${encodeURIComponent(token)}`;

          downloadLink.hidden = false;

          setState(
            "Purchase verified. Your private download is ready.",
            "ready",
          );

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
        `Waiting for signed Paddle confirmation… (${attempt}/${MAX_ATTEMPTS})`,
        "waiting",
      );

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          POLL_INTERVAL_MS,
        ),
      );
    }

    setState(
      "Purchase confirmation is taking longer than expected. Refresh this page in a few seconds. If needed, use the recovery page with your Paddle receipt.",
      "error",
    );
  }

  if (!config?.workerBase) {
    setState(
      "Fulfillment configuration is missing.",
      "error",
    );

    return;
  }

  const token = readToken();

  if (!token) {
    setState(
      "No purchase token was found. Use the recovery page if you already completed payment.",
      "error",
    );

    return;
  }

  waitForFulfillment(token);
})();
