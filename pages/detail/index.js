import Header from "../../components/header";
import { withRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
var CryptoJS = require("crypto-js");

const Index = (props) => {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState("");
  useEffect(() => {
    if (router?.query?.tokenId) {
      getNFTInfo(router?.query?.tokenId);
      const item = localStorage.getItem("user_address");
      alert(item);
      setUserAddress(item);
    }
  }, [router?.query?.tokenId]);

  const getNFTInfo = async (id) => {
    var data ={token_id : id, wallet_address :'0x3658A235f1c0529ffB37D082eb0C508c17FE12e8', signature:'0x3aCbFfcA89769dDa7d2974406febaACAbe443a0d'}
    var seaportOrder = {}
    var parameters = {}
    var offer = {}
    var response = await axios.post(`http://localhost:3333/api/v1/market/item`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log(response?.data);
       
    //       parameters.offerer = response?.data?.data?.listing[0].offerer
    //       offer.itemType = 2
    //       offer.token = response?.data?.data?.listing[0].token_address
    //       offer.identifierOrCriteria =  response?.data?.data?.listing[0].identifier_or_criteria//response?.data?.data?.listing[0].
    //       offer.startAmount = response?.data?.data?.listing[0].start_amount
    //       offer.endAmount = response?.data?.data?.listing[0].end_amount
    //       parameters.offer = [offer]
          
    //       var consideration = {}
    //       consideration.itemType = 1
    //       consideration.token = response?.data?.data?.listing[0].consideration_token_address
    //       consideration.identifierOrCriteria= response?.data?.data?.listing[0].consideration_identifier_or_criteria
    //       consideration.startAmount = response?.data?.data?.listing[0].consideration_start_amount
    //       consideration.endAmount = response?.data?.data?.listing[0].consideration_end_amount
    //       consideration.recipient =  response?.data?.data?.listing[0].consideration_recipient
    //       parameters.consideration = [consideration]
    //       //   setNftList(response?.data?.result);
    //       seaportOrder.parameters = parameters
    const provider = new ethers.providers.Web3Provider(window.ethereum);
          const seaport = new Seaport(provider, {
            overrides: {
              contractAddress: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
            },
          });
    console.log(response)
    if( response?.data?.data &&  response?.data?.data?.listing.length > 0) {
      var order_parameters_string = response?.data?.data?.listing[0].order_parameters
      var bytes = CryptoJS.AES.decrypt(order_parameters_string, process.env.HASH_KEY)
      var originalText = bytes.toString(CryptoJS.enc.Utf8)

      let order_parameters = JSON.parse(originalText)
      let order ={}
    //  order_parameters.endTime = '1681962708'
      order.parameters = order_parameters
      order.signature = response?.data?.data?.listing[0].order_signature
      const fullfiller = '0x54918E3831e807c1f4f5C8D6b7CD85723B3Ecf90'
      const { actions } = await seaport.fulfillOrder({
        order: order,
        accountAddress: fullfiller
      });

      for(let action of actions) {
        const approveGasLimit = { gasLimit: "215120"}
        // const estimatedGas = await action.transactionMethods.estimateGas(approveGasLimit);
        // var payableOverrides = { gasLimit: estimatedGas  };
         await action.transactionMethods.transact(approveGasLimit);
      }

      //const transaction = executeAllFulfillActions();
     console.log('success');
    }


      
      // const fullfiller = '0x54918E3831e807c1f4f5C8D6b7CD85723B3Ecf90'
      //     const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      //   order: order,
      //   accountAddress: fullfiller,
      // });

      // const transaction = executeAllFulfillActions();
     // console.log(JSON.stringify(transaction));
  };
  return (
    <>
      <Header page={"Detail"} isDetail />
      <div>Contract address: {userAddress}</div>
    </>
  );
};

export default withRouter(Index);
