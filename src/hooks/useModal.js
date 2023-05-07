import { useCallback, useState } from "react";

const useModal = (props) => {
  const { initialOpen = false } = props || {};
  const [isOpen, setisOpen] = useState(initialOpen);
  const close = useCallback(() => {
    setisOpen(false);
  }, []);
  const open = useCallback(() => {
    setisOpen(true);
  });
  const toggle = useCallback(() => {
    setisOpen(!isOpen);
  }, [isOpen]);
  return { close, open, isOpen, toggle };
};

export default useModal;
