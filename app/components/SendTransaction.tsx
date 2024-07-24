
// import { ethers } from "ethers";
// import React from "react";
// import { SendTransactionModalUIOptions, UnsignedTransactionRequest, User } from "@privy-io/react-auth";

// type Props = {
//   sendTransaction: (data: UnsignedTransactionRequest, uiOptions?: SendTransactionModalUIOptions | undefined) => Promise<any>;
//   user: User;
// };

// function SendTransaction({ sendTransaction, user }: Props) {
//   const sendTx = async () => {
//     const etherAmount = "0.01";
//     const weiValue = ethers.utils.parseEther(etherAmount);
//     const hexWeiValue = ethers.utils.hexlify(weiValue);
//     const unsignedTx = {
//       to: "0xc3Cf221109E88713Bd3901c4821d155c40e15fBC",
//       chainId: 122,
//       value: hexWeiValue,
//     };

//     const txUiConfig = {
//       header: "Send Transaction",
//       description: "Send 0.01 ETH to yourself",
//       buttonText: "Send",
//     };

//     if (user.wallet) {
//       await sendTransaction(unsignedTx, txUiConfig);
//     }
//   };

//   return (
//     <button
//       onClick={sendTx}
//       disabled={!user.wallet}
//       className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2 mt-4"
//     >
//       Send 0.01 ETH to Yourself
//     </button>
//   );
// }

// export default SendTransaction;

import { ethers } from "ethers";
import React from "react";
import { SendTransactionModalUIOptions, UnsignedTransactionRequest, User } from "@privy-io/react-auth";

type Props = {
  sendTransaction: (data: UnsignedTransactionRequest, uiOptions?: SendTransactionModalUIOptions | undefined) => Promise<any>;
  user: User;
};

function SendTransaction({ sendTransaction, user }: Props) {
  const sendTx = async () => {
    try {
      const etherAmount = "0.01";
      const weiValue = ethers.utils.parseEther(etherAmount);
      const hexWeiValue = ethers.utils.hexlify(weiValue);
      const unsignedTx = {
        to: "0xc3Cf221109E88713Bd3901c4821d155c40e15fBC",
        chainId: 122,
        value: hexWeiValue,
      };

      const txUiConfig = {
        header: "Send Transaction",
        description: "Send 0.01 ETH to yourself",
        buttonText: "Send",
      };

      if (user.wallet) {
        await sendTransaction(unsignedTx, txUiConfig);
      } else {
        console.error("User wallet not available");
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <button
      onClick={sendTx}
      disabled={!user.wallet}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2 mt-4"
    >
      Send 0.01 ETH to Yourself
    </button>
  );
}

export default SendTransaction;
