import { updateCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateCitizen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateCitizen(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['citizens'])
    }
  });
};

export default useUpdateCitizen;
