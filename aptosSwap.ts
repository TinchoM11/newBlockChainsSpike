import { AptoswapClient, TransactionOperation } from "@vividnetwork/swap-sdk";
import { AptosAccount, getAddressFromAccountOrAddress } from "aptos";



const createdAccountSigningKey = Uint8Array.from([
  57, 171, 168, 155, 184, 180, 200, 49, 36, 101, 95, 179, 36, 219, 179, 156, 83,
  1, 196, 133, 199, 98, 179, 16, 180, 229, 77, 131, 72, 114, 106, 79, 90, 147,
  27, 227, 184, 11, 139, 235, 79, 16, 180, 173, 234, 148, 0, 235, 50, 21, 122,
  183, 211, 144, 74, 225, 231, 133, 113, 179, 79, 177, 224, 72,
]);

const simpleSwap = async () => {

  const aptoswap = (await AptoswapClient.fromHost("https://aptoswap.net"))!;
  const packageAddr = aptoswap.getPackageAddress();
  const { pools } = await aptoswap.getCoinsAndPools();

  const pool = pools.filter(
    (p) =>
      p.type.yTokenType.name ===
        "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC" &&
      p.type.xTokenType.name === "0x1::aptos_coin::AptosCoin"
  )[0];
  if (pool === undefined) {
    console.log("Pool not found");
    return;
  }
  console.log("Pool found for swapping USDC to APTOS");

  // Will try to execute the swap operation
  const account = new AptosAccount(createdAccountSigningKey);
  console.log("Account Address:", account.address().toString());

  try {
    const operation: TransactionOperation.Swap = {
      operation: "swap",
      pool: pool,
      direction: "reverse", // can be "reverse" or "forward"
      amount: BigInt("10"),
    };

    const result = await aptoswap.execute(operation, account, {
      maxGasAmount: BigInt("4000"),
    });
    console.log(result.hash, " ", result.success);
  } catch (error) {
    console.log("Error while trying to swap Aptos:", error);
  }
};

simpleSwap();
