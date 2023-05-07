import classNames from "classnames";
import React, { ReactElement } from "react";
interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon: ReactElement;
}
const IconButton = ({ icon, className, children, ...rest }: Props) => {
  return (
    <button
      className={classNames(
        "flex items-center justify-center p-3 rounded-full hover:opacity-80 transition-opacity space-x-2 text-base font-semibold",
        className
      )}
      {...rest}
    >
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
};

export default IconButton;
