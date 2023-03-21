import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Index = ({ page }) => {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const router = useRouter();

  const [client, setclient] = useState({
    isConnected: false,
  });

  const checkConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setclient({
          isConnected: true,
          address: accounts[0],
        });
      } else {
        setclient({
          isConnected: false,
        });
      }
    } else {
      sethaveMetamask(false);
    }
  };

  const connectWeb3 = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      if (client.isConnected) {
        setclient({
          isConnected: false,
        });
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setclient({
        isConnected: true,
        address: accounts[0],
      });
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <nav className="fren-nav d-flex">
      <div style={{ backgroundColor: page === "Marketplace" ? "transparent" : "red", borderRadius: 4 }}>
        <button
          onClick={() => router.push("/")}
          type="button"
          data-te-ripple-init
          data-te-ripple-color="light"
          className="inline-block rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
        >
          My NFT
        </button>
      </div>
      <div style={{ backgroundColor: page === "Home" ? "transparent" : "red", borderRadius: 4 }} className="ml-[20px]">
        <button
          onClick={() => router.push("/marketplace")}
          type="button"
          data-te-ripple-init
          data-te-ripple-color="light"
          className="inline-block rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
        >
          Marketplace
        </button>
      </div>

      <div className="d-flex" style={{ marginLeft: "auto" }}>
        <div>
          <button className="btn connect-btn" onClick={() => connectWeb3()}>
            {client.isConnected ? (
              <>
                {client.address.slice(0, 4)}...
                {client.address.slice(38, 42)}
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Index;
