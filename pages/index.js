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

const Index = () => {
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    getListNFT();
  }, []);
  const getListNFT = () => {
    axios
      .get("http://localhost:3333/api/v1/nft/list?address=0xf6541439A90E7e340E913A2D70Dc1Ee283D1E90A&limit=20")
      .then(function (response) {
        // handle success
        console.log(response?.data);
        if (response?.data?.result && response?.data?.result.length > 0) {
          setNftList(response?.data?.result);
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const seaport = new Seaport(provider, {
      overrides: {
        contractAddress: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
      },
    });

    const offerer = "0xf6541439A90E7e340E913A2D70Dc1Ee283D1E90A";
    // const fulfiller = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

    const { executeAllActions } = await seaport.createOrder({
      offer: [
        {
          itemType: ItemType.ERC721,
          token: "0x3cdA5802ae0e3553192326f5d270771A14bf8D34",
          identifier: "2",
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther("10").toString(),
          token: "0x13C0B86d8e78354cA94469D8Fa3939599AE4e221",
        },
      ],
    });

    const order = await executeAllActions();

    const xxx1 = await seaport.createOrder({
      offer: [
        {
          itemType: ItemType.ERC721,
          token: "0x3cdA5802ae0e3553192326f5d270771A14bf8D34",
          identifier: "2",
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther("1").toString(),
          token: "0x13C0B86d8e78354cA94469D8Fa3939599AE4e221",
        },
      ],
    });

    const order1 = await xxx1.executeAllActions();
    console.log("??", order1);
    // const signer = provider.getSigner();

    // const seaportContract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKET_CONTRACT, SeaportAbi.abi, signer);
    // const orderHash = await seaportContract.getOrderHash(order.parameters);

    // var hashText = CryptoJS.AES.encrypt(JSON.stringify(order.parameters), process.env.NEXT_PUBLIC_HASH_KEY).toString();
    // axios
    //   .post("http://127.0.0.1:3333/api/v1/order/create", {
    //     input_order: hashText,
    //     order_hash: orderHash,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    // const receipt = await seaport.cancelOrders([order.parameters], order.parameters.offerer).transact();
    // console.log(JSON.stringify(receipt));

    const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      order: order1,
      accountAddress: offerer,
    });

    const transaction = await executeAllFulfillActions();
    console.log(JSON.stringify(transaction));

    const { executeAllActions: yyy } = await seaport.fulfillOrder({
      order,
      accountAddress: offerer,
    });

    const transaction1 = await yyy();
    console.log(JSON.stringify(transaction1));
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
              <div className="w-[30px]">
                {e?.token_address.slice(0, 10)}...
                {e?.token_address.slice(e?.token_address.length - 10, e?.token_address.length)}
              </div>
              <div>Token ID: {e?.token_id}</div>
              <div>Type: {e?.contract_type}</div>
              <div>Symbol: {e?.symbol}</div>
              <div>Name: {e?.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Index;
