import { Contract } from "ethers/lib";
import { getProviderOrSigner } from "./accountsConnect";
import {
  whitelistContractABI,
  WebsiteRentABI,
  WebsiteRentAddress,
} from "./contractMetdadata";
import { getTokensMetaData } from "./IpfsInteraction";

export const getWebsiteRentContract = async (
  Blockchain,
  networkChain,
  web3ModalRef
) => {
  if (Blockchain == "polygon") {
    let provider = await getProviderOrSigner(web3ModalRef);
    const websiteRentContract = new Contract(
      WebsiteRentAddress,
      WebsiteRentABI,
      provider
    );
    return websiteRentContract;
  } else if (Blockchain == "tron") {
  } else {
    //
  }
};
export const getWhitelistContract = async (
  Blockchain,
  NetworkChain,
  web3ModalRef,
  contractAddress
) => {
  if (Blockchain == "polygon") {
    let signer = await getProviderOrSigner(web3ModalRef, true);
    const whitelistContract = new Contract(contractAddress, whitelistContractABI, signer);
    return whitelistContract;
  } else if (Blockchain == "tron") {
  } else {
    //
  }
};


export async function getCollectionURIs(
  Blockchain,
  NetworkChain,
  web3ModalRef,
  contract
) {
  let _totalSupply = await contract.totalSupply();
  let numNFTsToFetch = 0;
  numNFTsToFetch = parseInt(_totalSupply);
  let baseURIs = [];

  console.log("Obtaining ", numNFTsToFetch, " NFTs");
  let baseUri=await contract.baseURI();
  if(baseUri.toString().endsWith("/")){
    baseUri=baseUri.slice(0,-1);
  }
  for (let index = 0; index < numNFTsToFetch; index++) {
      let tokenuri=baseUri+`/${index+1}.json`;    
      baseURIs.push(tokenuri);
  }
    // console.log("base uris are ", baseURIs);
  return baseURIs;
}
function noDeployment(adr) {
  if (
    !adr ||
    adr?.toString().includes("0x0000") ||
    adr?.toString().includes("0X0000")
  )
    return true;

  return false;
}



export async function getCurrentDeployment(
  Blockchain,
  NetworkChain,
  web3ModalRef,
  websiteURL
) {
  //   console.log("inside getting current deployment");
  let contract = await getWebsiteRentContract(
    Blockchain,
    NetworkChain,
    web3ModalRef
  );
  //   console.log("contract is ", contract);
  console.log("checking Deployment of _" + websiteURL + "_");
  let _currentDeployment = await contract.websiteToDeployment(websiteURL);
  //   console.log("curremt deployment", _currentDeployment);
  if (noDeployment(_currentDeployment)) {
    console.log("No deployment");
    return null;
  }

  let rentTime = await contract.rentTime(websiteURL);

  let jsEpochRentTime = parseInt(rentTime * 1000);
  let currentTime = new Date().getTime();
  if (jsEpochRentTime <= currentTime) {
    _currentDeployment = null;
  }
  return { currentDeployment: _currentDeployment, rentTime };
}
