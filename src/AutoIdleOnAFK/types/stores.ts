import { DiscStatusTypes } from "./common";

export default interface Store {
  addChangeListener: (listener: () => void) => void;
  removeChangeListener: (listener: () => void) => void;
}

export interface SelectedChannelStore extends Store {
  getChannelId(): string | null | undefined;
  getCurrentlySelectedChannelId(): string | null | undefined;
  getLastChannelFollowingDestination(): string | null | undefined;
  getLastSelectedChannelId(): string | null | undefined;
  getLastSelectedChannels(): string | null | undefined;
  getMostRecentSelectedTextChannelId(): string | null | undefined;
  getVoiceChannelId(): string | null | undefined;
}

export interface SessionsStore extends Store {
  getSession(): {
    sessionId: string;
    status: DiscStatusTypes | "unknown";
    activities: [];
    active: boolean;
    clientInfo: { client: "desktop" | "mobile"; os: string; version: 0 };
  };
}
