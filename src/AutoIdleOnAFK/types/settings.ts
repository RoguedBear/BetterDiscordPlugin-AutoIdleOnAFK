import { DiscStatusTypes } from "./common";

export default interface Setting {
  getSetting(): any;
  updateSetting(n: any): Promise<any>;
  useSetting(): [any, (val: any) => Promise<any>];
}

export interface StatusSetting extends Setting {
  getSetting(): DiscStatusTypes;
  updateSetting(status: DiscStatusTypes): Promise<any>;
}

export type AllModules = { StatusSetting: StatusSetting };
