import Header from "../../components/header";
import { withRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

  const getNFTInfo = (id) => {
    axios
      .get(`http://localhost:3333/api/v1/nft/detail?token_id=${id}`)
      .then(function (response) {
        // handle success
        console.log(response?.data);
        if (response?.data?.result && response?.data?.result.length > 0) {
          console.log(response?.data);
          //   setNftList(response?.data?.result);
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
  return (
    <>
      <Header page={"Detail"} isDetail />
      <div>Contract address: {userAddress}</div>
    </>
  );
};

export default withRouter(Index);
