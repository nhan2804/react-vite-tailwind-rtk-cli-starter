import useModal from "@hooks/useModal";
import { Button, Drawer, Modal } from "antd";
import React from "react";
import { useImperativeHandle } from "react";
const CustomDrawer = (
  {
    button,
    children,
    title,
    placement = "right",
    noButton = false,
    width = 400,
    onClose,
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

      <Drawer
        width={width}
        destroyOnClose={true}
        closable={true}
        title={title || "Tiêu đề"}
        placement={placement}
        onClose={() => {
          close();
          onClose?.();
        }}
        open={isOpen}
      >
        {children?.({ open, close }) || children}
      </Drawer>
    </>
  );
};

export default React.forwardRef(CustomDrawer);
