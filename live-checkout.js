(() => {
  const config = window.QA_PADDLE;
  const buyButton = document.getElementById("live-buy");
  const status = document.getElementById("live-status");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("sandbox-error", isError);
  }

  function createFulfillmentToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  try {
    if (!config) {
      throw new Error("Live Paddle configuration is missing.");
    }

    if (
      !config.clientToken ||
      config.clientToken === "LIVE_CLIENT_TOKEN_HERE"
    ) {
      throw new Error("Live Paddle client token has not been configured.");
    }

    if (!window.Paddle) {
      throw new Error("Paddle.js did not load.");
    }

    Paddle.Initialize({
      token: config.clientToken,
    });

    buyButton.disabled = false;
    buyButton.textContent = "Open real $59 checkout";
    setStatus(
      "Live checkout is ready. A real payment will be charged.",
    );

    buyButton.addEventListener("click", () => {
      const fulfillmentToken = createFulfillmentToken();

      sessionStorage.setItem(
        "qaLiveFulfillmentToken",
        fulfillmentToken,
      );

      const successUrl = new URL(
        "live-success.html",
        window.location.href,
      );

      successUrl.hash = new URLSearchParams({
        token: fulfillmentToken,
      }).toString();

      setStatus("Opening Paddle Live checkout…");

      Paddle.Checkout.open({
        settings: {
          successUrl: successUrl.toString(),
        },
        customData: {
          fulfillment_token: fulfillmentToken,
        },
        items: [
          {
            priceId: config.standardPriceId,
            quantity: 1,
          },
        ],
      });
    });
  } catch (error) {
    buyButton.disabled = true;
    buyButton.textContent = "Checkout unavailable";

    setStatus(
      error instanceof Error
        ? `Could not initialize Paddle: ${error.message}`
        : "Could not initialize Paddle.",
      true,
    );
  }
})();
