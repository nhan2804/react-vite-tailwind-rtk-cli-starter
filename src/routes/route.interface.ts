import { ComponentType } from "react";

export interface IRoute {
  path: string;
  component: ComponentType<any> | any;
  isPrivate?: boolean;
  index?: boolean;
  role?: Array<string>;
  exact?: boolean;
  children?: IRoute[];
  match?: boolean;
  accessRole?: string[];
}
