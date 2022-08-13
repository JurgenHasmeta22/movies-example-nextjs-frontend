import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import { addBackToTop } from "vanilla-back-to-top";
import {useEffect} from "react"
function MyApp({ Component, pageProps }) {

  useEffect(function mount() {

    function onScroll() {
      addBackToTop()
    }

    window.addEventListener("load", onScroll);

    return function unMount() {
      window.removeEventListener("load", onScroll);
    };

  });

  return (
    <>
      <NextNProgress
        color="#29D"
        startPosition={0.5}
        stopDelayMs={400}
        height={4}
        showOnShallow={true}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
