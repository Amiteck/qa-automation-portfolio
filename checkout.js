(() => {
  const config = window.QA_PADDLE;
  const buttons = Array.from(document.querySelectorAll("[data-paddle-buy]"));

  function setButtons(label, disabled) {
    for (const button of buttons) {
      button.textContent = label;
      button.disabled = disabled;
    }
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

    setButtons("Buy now — $39", false);

    for (const button of buttons) {
      button.addEventListener("click", () => {
        const fulfillmentToken = createFulfillmentToken();

        sessionStorage.setItem(
          "qaFulfillmentToken",
          fulfillmentToken,
        );

        const successUrl = new URL(
          "success.html",
          window.location.href,
        );

        successUrl.hash = new URLSearchParams({
          token: fulfillmentToken,
        }).toString();

        Paddle.Checkout.open({
          settings: {
            successUrl: successUrl.toString(),
          },
          customData: {
            fulfillment_token: fulfillmentToken,
          },
          items: [
            {
              priceId: config.launchPriceId,
              quantity: 1,
            },
          ],
        });
      });
    }
  } catch (error) {
    setButtons("Checkout temporarily unavailable", true);
    console.error(error);
  }
})();
