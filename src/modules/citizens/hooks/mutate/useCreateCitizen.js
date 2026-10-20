import { createCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateCitizen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createCitizen(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['citizens'])
    }
  });
};

export default useCreateCitizen;
