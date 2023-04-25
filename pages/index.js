import { useState, useEffect } from "react";
import { signMessage } from "../utils/sign";
var CryptoJS = require("crypto-js");
import { useRouter } from "next/router";
import Header from "../components/header";
import Link from "next/link";
import Metamask from "../components/metamask";
import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";
import SeaportAbi from "./Seaport.json";
import axios from "axios";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { DateTime } from 'luxon'

const Index = () => {
  const [nftList, setNftList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    getListNFT();
  }, []);
  const getListNFT = () => {
    var data ={wallet_address :'0x5bc97279854AD7D566717bC2de9479E67982A172', signature:'0xe8d59cef88f209420c939e10980ffe02ee85fa4f341121af88eca79edce3cf1f02aeec6551cf3a3fd433b7b1e14c3800aec6e5460569c9d5261edfb2f1453bdf1b'}
    axios.post(`https://fxb-test.icetea-software.com/api/v1/nft/list`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
        // handle success
        console.log(response?.data);
        if (response?.data && response?.data.length > 0) {
          setNftList(response?.data);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };
  const createOrder = async (data) => {
   //  console.log(data);
    // router.push({
    //   pathname: "/detail",
    //   query: { tokenId: JSON.stringify(parseInt(191)) },
    // });
    // return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const seaport = new Seaport(provider, {
      overrides: {
        contractAddress: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
      },
    });

    const startTime = Math.floor(DateTime.utc().toSeconds());
    const endTime = "1703148402";

    const offerer = "0x5bc97279854AD7D566717bC2de9479E67982A172";
    // const fulfiller = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

    const { executeAllActions } = await seaport.createOrder({
      startTime,
      endTime,
      offer: [
        {
          itemType: ItemType.ERC721,
          token: process.env.NEXT_PUBLIC_NFT_CONTRACT,
          identifier: ''+ data?.nft_id,
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther("100").toString(),
          token: process.env.NEXT_PUBLIC_BUSD,
        },
      ],

      fees: [{ recipient: '0x3aCbFfcA89769dDa7d2974406febaACAbe443a0d', basisPoints: 300 }],
    }, offerer);

    const order = await executeAllActions();

    // const xxx1 = await seaport.createOrder({
    //   offer: [
    //     {
    //       itemType: ItemType.ERC721,
    //       token: "0x3cdA5802ae0e3553192326f5d270771A14bf8D34",
    //       identifier: "2",
    //     },
    //   ],
    //   consideration: [
    //     {
    //       amount: ethers.utils.parseEther("1").toString(),
    //       token: "0x13C0B86d8e78354cA94469D8Fa3939599AE4e221",
    //     },
    //   ],
    // });

    // const order1 = await xxx1.executeAllActions();
     console.log("??", order);
     const signer = provider.getSigner();

     const seaportContract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKET_CONTRACT, SeaportAbi.abi, signer);
     const orderHash = await seaportContract.getOrderHash(order.parameters);

     var hashText = CryptoJS.AES.encrypt(JSON.stringify(order.parameters), process.env.NEXT_PUBLIC_HASH_KEY).toString();
    // console.log("?????", orderHash);
    axios
      .post("http://localhost:3333/api/v1/market/order/create", {
        input_order: hashText,
        order_hash: orderHash,
        wallet_address :'0x5bc97279854AD7D566717bC2de9479E67982A172',
        signature:'0xe8d59cef88f209420c939e10980ffe02ee85fa4f341121af88eca79edce3cf1f02aeec6551cf3a3fd433b7b1e14c3800aec6e5460569c9d5261edfb2f1453bdf1b',
        order_signature: order.signature
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    // const receipt = await seaport.cancelOrders([order.parameters], order.parameters.offerer).transact();
    // console.log(JSON.stringify(receipt));

    // const { actions } = await seaport.fulfillOrder({
    //   order: order,
    //   accountAddress: offerer,
    // });
    
    // for(let action of actions) {
    //   const approveGasLimit = { gasLimit: "215120"}
    //   // const estimatedGas = await action.transactionMethods.estimateGas(approveGasLimit);
    //   // var payableOverrides = { gasLimit: estimatedGas  };
    //    await action.transactionMethods.transact(approveGasLimit);
    // }


    // console.log(approvalAction)

    // const { executeAllActions: yyy } = await seaport.fulfillOrder({
    //   order,
    //   accountAddress: offerer,
    // });

    // const transaction1 = await yyy();
    //  console.log(JSON.stringify(transaction));
  };
  return (
    <>
      <Header page={"Home"} />

      <div className="grid grid-cols-3 gap-4 place-content-center h-full w-full p-[40px]">
        {nftList.map((e, index) => {
          return (
            <div
              key={`${e}-${index}`}
              onClick={() => createOrder(e)}
              className="flex flex-col justify-between mt-[8px] bg-slate-700 active:bg-slate-500 p-2 rounded-lg"
            >
              <div>Contract address:</div>
              <div>Token ID: {e?.nft_id}</div>
              <div>Name: {e?.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Index;
