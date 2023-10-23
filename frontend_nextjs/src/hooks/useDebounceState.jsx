import { debounce } from "../utils/opLodash";
import { useCallback, useState } from "react";

export default function useDebounceState(defaultState, time = 400) {
  const [state, setState] = useState(defaultState);
  const debounceSetState = useCallback(debounce(setState, time), []);
  return [state, debounceSetState];
}
