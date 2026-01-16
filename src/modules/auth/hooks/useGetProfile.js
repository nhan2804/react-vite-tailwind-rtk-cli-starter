import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/auth";
import { useAppDispatch } from "@hooks/reduxHook";
import { updateUser } from "@modules/auth/slices";
const useGetProfile = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["userProfile"],

    queryFn: async () => {
      const { data } = await getProfile();
      return data;
    }
  });
};

export default useGetProfile;
