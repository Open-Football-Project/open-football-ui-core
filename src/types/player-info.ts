import { VideoContent } from "./video-content";

export interface PlayerMainInfo {
  playerId: number;
  name: string;
  age: number;
  nationality: string;
  position: string;
  height: string;
  weight: string;
  teamId: number;
  teamName: string;
  teamLogo?: string | null;
  photo?: string | null;
  injured: boolean;
  videos?: VideoContent[];
}
