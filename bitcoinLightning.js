async function enable() {
  if (typeof window.webln === "undefined") {
    return alert("No WebLN available.");
  }

  try {
    await window.webln.enable();
    celebrate();

    // Add class to element
    document.getElementById("enableButton").classList.add("buttonEnabled");
    document.getElementById("enableButton").innerText = "Enabled";
  } catch (error) {
    alert("User denied permission or cancelled.");
  }
}

function celebrate() {
  // Show alert that is connected
  alert("Connected to WebLN!");
}

async function getInfoOfAccount() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  const info = await webln.getInfo();
  console.log(info);

  const infoDiv = document.createElement("div");

  const nodeAlias = document.createElement("p");
  nodeAlias.innerText = "Node Alias: " + info.node.alias;

  const nodeMethods = document.createElement("p");
  nodeMethods.innerText = "Node Methods: " + info.methods;

  infoDiv.appendChild(nodeAlias);
  infoDiv.appendChild(nodeMethods);

  document.getElementById("info").innerHTML = infoDiv.innerHTML;
}

async function keySend() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  const toAddress = document.getElementById("toAddress").value;
  const amount = document.getElementById("toAmount").value;

  try {
    const result = await webln.keysend({
      destination: toAddress,
      amount,
    });
    console.log(result);
  } catch (error) {
    alert("Error sending tx: " + error);
  }
}

async function makeInvoice() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  const amount = document.getElementById("createInvoiceAmount").value;
  try {

    const result = await window.webln.makeInvoice({
      amount: amount,
    });

    const invoiceResponseDiv = document.createElement("div");
    invoiceResponseDiv.className = "makeInvoiceResponse";

    const invoiceHash = document.createElement("p");
    invoiceHash.innerText = "Request Hash: " + result.rHash;

    const invoiceRequest = document.createElement("p");
    invoiceRequest.innerText = "PaymentRequest: " + result.paymentRequest;

    invoiceResponseDiv.appendChild(invoiceHash);
    invoiceResponseDiv.appendChild(invoiceRequest);

    document.getElementById("makeInvoice").innerHTML =
      invoiceResponseDiv.innerHTML;
  } catch (error) {
    console.log(error);
    alert("An error occurred during the makeInvoice() call.");
  }
}

async function sendPayment() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  try {
    const invoice = prompt("Please provide an invoice (lnbc...)");
    const result = await window.webln.sendPayment(invoice);
    console.log(result);
  } catch (error) {
    alert("An error occurred during the payment.");
  }
}

async function signMessage() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  const message = document.getElementById("message").value;
  const res = await webln.signMessage(message);
  document.getElementById("messageInfo").innerText =
    "Signature: " + res.signature;
}

async function verifyMessage() {
  if (!webln.isEnabled) {
    return alert("Please Enable WebLn first.");
  }

  const message = prompt("Insert the signed message:");
  const signature = prompt("Insert the signature:");
  const res = await window.webln.verifyMessage(signature, message);
  console.log(res);
}
