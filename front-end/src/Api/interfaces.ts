export interface CarI {
  id: number;
  name: string;
  color: string;
  isEngineStarted: boolean;
}

export enum EngineStatus {
  START = "start",
  STOP = "stop",
  DRIVE = "drive",
}

export interface GetCarsI {
  items: CarI[];
  totalCount: number;
}

export interface StartStopI {
  status: string;
}

export interface DriveI {
  status: number;
}
