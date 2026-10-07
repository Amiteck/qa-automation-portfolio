(() => {
  const CLIENT_TOKEN = "test_1911d302cd06e4845194aa9b371";
  const PRICE_ID = "pri_01m4b7ctdpn6nh57rdxazy9ysd";

  const buyButton = document.getElementById("sandbox-buy");
  const status = document.getElementById("sandbox-status");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("sandbox-error", isError);
  }

  try {
    if (!window.Paddle) {
      throw new Error("Paddle.js did not load.");
    }

    Paddle.Environment.set("sandbox");
    Paddle.Initialize({
      token: CLIENT_TOKEN,
    });

    buyButton.disabled = false;
    buyButton.textContent = "Open $59 sandbox checkout";
    setStatus("Sandbox checkout is ready. No real payment will be charged.");

    buyButton.addEventListener("click", () => {
      setStatus("Opening Paddle sandbox checkout…");

      Paddle.Checkout.open({
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
