import { createBulkCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBulkCitizen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkCitizen(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['citizens'])
    }
  });
};

export default useCreateBulkCitizen;
