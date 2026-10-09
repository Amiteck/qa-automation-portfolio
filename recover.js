const WORKER_ORIGIN =
  "https://qa-portfolio-fulfillment-live.igor9063.workers.dev";

const form = document.querySelector("#recovery-form");
const emailInput = document.querySelector("#recovery-email");
const invoiceInput = document.querySelector("#recovery-invoice");
const submitButton = document.querySelector("#recovery-submit");
const message = document.querySelector("#recovery-message");
const downloadLink = document.querySelector("#recovery-download");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const invoiceNumber = invoiceInput.value.trim();

  downloadLink.hidden = true;
  downloadLink.removeAttribute("href");
  message.classList.remove("recovery-error", "recovery-success");

  if (!email || !invoiceNumber) {
    message.textContent =
      "Enter both your purchase email and Paddle invoice number.";
    message.classList.add("recovery-error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Checking purchase…";
  message.textContent = "Verifying your completed Paddle purchase…";

  try {
    const response = await fetch(`${WORKER_ORIGIN}/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        invoiceNumber,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.downloadUrl) {
      throw new Error("Purchase not found");
    }

    message.textContent =
      "Purchase verified. A fresh private download link is ready.";
    message.classList.add("recovery-success");
    downloadLink.href = data.downloadUrl;
    downloadLink.hidden = false;
  } catch {
    message.textContent =
      "We could not verify a completed purchase with those details. Check the email and invoice number from your Paddle receipt, then try again.";
    message.classList.add("recovery-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Recover download";
  }
});
