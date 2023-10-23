import React from "react";
import { useMediaQuery } from "react-responsive";

function UseScreenDetect() {
  return {
    isMobile: useMediaQuery({ query: "(max-width: 639px)" }),
    isTablet: useMediaQuery({ query: "(max-width: 1024px)" }),
  };
}

export default UseScreenDetect;
