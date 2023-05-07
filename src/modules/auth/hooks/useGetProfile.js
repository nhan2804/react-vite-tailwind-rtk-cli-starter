import { useQuery } from "react-query";
import { getProfile } from "../services/auth";
import { useAppDispatch } from "@hooks/reduxHook";
import { updateUser } from "@modules/auth/slices";
const useGetProfile = () => {
  const dispatch = useAppDispatch();
  return useQuery(
    ["userProfile"],
    async () => {
      const { data } = await getProfile();
      return data;
    },
    {
      onSuccess: (data) => {
        dispatch(updateUser({ user: data }));
      },
    }
  );
};

export default useGetProfile;
