import classNames from "classnames";
import React, { forwardRef } from "react";
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = ({ className, ...rest }: Props, ref) => {
  return (
    <input
      {...rest}
      ref={ref}
      className={classNames("custom-input", className)}
    />
  );
};

export default forwardRef(Input);
