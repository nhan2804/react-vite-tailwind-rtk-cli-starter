import axios from "axios";
import { useQuery } from "react-query";

const useWatchVersion = () => {
  return useQuery({
    queryKey: ["watch-version"],
    queryFn: async () => {
      const { data } = await axios.get("version");
      return data;
    },
    refetchInterval: 1000 * 30,
    retry: 3,
    onError: () => {
      throw new Error("Watch version error, please check network!");
    },
  });
};

export default useWatchVersion;
