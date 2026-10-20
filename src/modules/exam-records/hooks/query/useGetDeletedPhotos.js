import { getDeletedPhotos } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetDeletedPhotos = (sessionId, options = {}) => {
  return useQuery({
    queryKey: ["exam-records-deleted-photos", sessionId],
    queryFn: async () => {
      return await getDeletedPhotos(sessionId);
    },
    ...options,
  });
};

export default useGetDeletedPhotos;
