import useModal from "@hooks/useModal";
import { Button, Drawer, Modal } from "antd";
import React from "react";
import { useImperativeHandle } from "react";
const CustomModal = (
  {
    button,
    children,
    title,
    placement = "right",
    noButton = false,
    width = 400,
    footer,
    destroyOnClose = true,
    onOk,
    closable = true,
  },
  ref
) => {
  const { close, open, toggle, isOpen } = useModal({ initialOpen: false });
  useImperativeHandle(
    ref,
    () => {
      return { close, open, toggle };
    },
    [close, open, toggle]
  );
  return (
    <>
      {!noButton && (
        <>
          {button?.({ open, toggle }) || (
            <Button onClick={open} type="primary">
              Open
            </Button>
          )}
        </>
      )}

      <Modal
        footer={footer}
        width={width}
        maskClosable={closable}
        destroyOnClose={destroyOnClose}
        closable={closable}
        onOk={onOk || close}
        title={title || "Tiêu đề"}
        // onClose={close}
        onCancel={close}
        open={isOpen}
      >
        {children?.({ open, close }) || children}
      </Modal>
    </>
  );
};

export default React.forwardRef(CustomModal);
