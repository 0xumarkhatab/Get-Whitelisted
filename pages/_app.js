import "../styles/globals.css";
import React from "react";
import Home from "./index";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
const { chains, provider } = configureChains(
  [chain.goerli,chain.mainnet,chain.polygonMumbai],
  [alchemyProvider({ apiKey: "OINpsQZSN0z6VRLC1jL5YYrLmQiYGARE" })]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Home />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
