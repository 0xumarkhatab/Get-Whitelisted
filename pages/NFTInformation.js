import React, { useEffect, useRef, useState } from "react";
import {
  getWhitelistContract,
  getTokenOwner,
  mint,
} from "../SmartContractsStuff/contractInteraction";
import styles from "../styles/NFTInformation.module.css";
import Web3Modal from "web3modal";
import { useAccount } from "wagmi";

let Blockchain = "ethereum";
let NetworkChain = "goerli";

function NFTInformation(props) {
  const { isConnected, isDisconnected, address } = useAccount();
  const [userIsWhitelisted, setUserIsWhitelisted] = useState(false);
  const [whitelistingStatus, setwhitelistingStatus] = useState("whitelist me");

  let nft = props.NFT;
  let toggler = props.toggler;
  let contractAddress = props.contractAddress;
  let whitelistStatus = props.whitelistStatus;
  let isWhitelisted = props.isWhitelisted;
  let nftPrice = parseInt(nft?.price);
  let nftOwner = nft.owner;
  nftPrice = nftPrice / 10 ** 18;

  let web3ModalRef = useRef();
  async function whitelistMe(tokenId) {
    if (userIsWhitelisted) {
      alert("You already Whitelisted ..");
      return null;
    }

    if (!whitelistStatus) {
      alert("Whitelist has ended already  ..");
      return null;
    }

    alert("Stated whitelisting ...");
    if (web3ModalRef.current === undefined) {
      web3ModalRef.current = new Web3Modal({
        network: NetworkChain,
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    setwhitelistingStatus("whitelisting..");
    setTimeout(() => {
      setwhitelistingStatus("Please Wait..");
    }, 4000);
    let whitelistContract = await getWhitelistContract(
      Blockchain,
      NetworkChain,
      web3ModalRef,
      contractAddress
    );
    console.log("sale contract is ", whitelistContract);
    try {
      var options = { gasLimit: 300000 };

      let tx = await whitelistContract.addAddressToWhitelist();

      setwhitelistingStatus("Wait for confirmation..");
      await tx.wait();
      successCallback();
    } catch (e) {
      console.log("unable to whitelist", e);
      if (e.toString().includes("has ended"))
        setwhitelistingStatus("Whitelisting ended!");
    }
  }
  async function successCallback() {
    setwhitelistingStatus("Whitelisted Successfully 🥳");
    setUserIsWhitelisted(true);
  }
  function getCurrency() {
    return Blockchain == "ethereum"
      ? "ETH"
      : Blockchain == "tron"
      ? "TRX"
      : Blockchain == "polygon"
      ? "MATIC"
      : "Un-supported";
  }

  function getMinimalAddress(adr) {
    if (!adr) return "Fetching..";
    if (adr.toString().includes("0000")) {
      return null;
    }
    return adr.slice(0, 5) + "..." + adr.slice(40);
  }

  useEffect(() => {
    setUserIsWhitelisted(isWhitelisted);
  }, []);

  return (
    <div className={styles.nft__information__wrapper}>
      <div className={styles.nft__information__content}>
        <img
          className={styles.nft__information__content__image}
          src={nft.image}
        />
        <p className={styles.nft__information__content__name}>
          <p className={styles.property}>name</p>
          <p className={styles.value}>{nft.name}</p>
        </p>
        <p className={styles.nft__information__content__price}>
          <p className={styles.property}>price</p>
          <p className={styles.value}>{"coming soon"}</p>
        </p>
        <p className={styles.nft__information__content__owner}>
          <p className={styles.property}>owner</p>
          <p className={styles.value}>No Owner</p>
        </p>

        <button
          className={styles.nft__information__content__button}
          onClick={() => whitelistMe(nft.id)}
          disabled={whitelistingStatus !== "whitelist me" && !whitelistStatus}
        >
          {userIsWhitelisted
            ? "You are Whitelisted ✔ "
            : !whitelistStatus
            ? "Whitelisting has Ended !"
            : whitelistingStatus}
        </button>
        <button
          className={styles.nft__information__content__button}
          onClick={() => {
            toggler(null);
          }}
        >
          Cancel{" "}
        </button>
      </div>
    </div>
  );
}

export default NFTInformation;
