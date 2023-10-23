import { useRouter } from "next/router";

function useQueryUrl() {
  const router = useRouter();
  return new URLSearchParams(router.query);
}

export default useQueryUrl;
