(() => {
  const CLIENT_TOKEN = "live_d35a57945c9ed044d7751d63586";
  const PRICE_ID = "pri_01m4fkwgh8v4t0f2z5sgq6rqrg";

  const buyButton = document.getElementById("live-buy");
  const status = document.getElementById("live-status");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("sandbox-error", isError);
  }

  function createFulfillmentToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  try {
    if (!window.Paddle) {
      throw new Error("Paddle.js did not load.");
    }

    Paddle.Initialize({
      token: CLIENT_TOKEN,
    });

    buyButton.disabled = false;
    buyButton.textContent = "Open real $59 checkout";
    setStatus("Live checkout is ready. A real payment will be charged.");

    buyButton.addEventListener("click", () => {
      const fulfillmentToken = createFulfillmentToken();
      sessionStorage.setItem("qaLiveFulfillmentToken", fulfillmentToken);

      const successUrl = new URL("live-success.html", window.location.href);
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
            priceId: PRICE_ID,
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
