import React from "react";

export default function useDebounceFunction(delay, callbackFn) {
  const [debouncedValue, setCheckTyping] = React.useState({
    textSearch: "",
    typing: false,
    typingTimeOut: 0,
  });

  function debounceFn(value, p) {
      clearTimeout(debouncedValue.typingTimeOut);
      setCheckTyping({
          textSearch: value,
          typing: false,
          typingTimeOut: setTimeout(() => {
              if (!callbackFn) return;
              callbackFn(value);
          }, delay),
      });
  }

  return debounceFn;
}
