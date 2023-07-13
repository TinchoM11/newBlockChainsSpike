const ethers = require("ethers");

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://docs-demo.base-goerli.quiknode.pro/",
  );
  const balance = await provider.getBalance(
    "0x622Fbe99b3A378FAC736bf29d7e23B85E18816eB",
    "latest"
  );

  // Balance of Specific Address:
  console.log("Balance of Specific Address on BASE:");
  console.log(balance.toString());

  // Transaction Information:
  const txInfo = await provider.send("eth_getTransactionByHash", [
    "0x8e7b0d39a94d36957a2750b6bfce88caacfdcbc8a1d5f667a452cc37ae775aac",
  ]);
  console.log("--------------------");
  console.log("Get  Transaction Information:");
  console.log(txInfo);

  // Get Transaction Receipt:

  const txReceipt = await provider.waitForTransaction(
    "0xd6c8889fd1dbe4892be9832c4875dae0d689324962466a5c9745594fe8b91e2e"
  );
  console.log("--------------------");
  console.log("Get  Transaction Receipt:");
  console.log(txReceipt);

  // Send Transaction:
})();
