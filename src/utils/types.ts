export interface userResponse {
  username: string,
  email: string,
  isActive: boolean,
  id: string,
}
export interface userdetailresponse extends userResponse {
  groups: roomResponse[],
  createdgroups: any[]
}

export type roomResponse = {
  id: string,
  roomname: string,
  description: string,
  isActive: boolean

}
export interface RoomData {
  id: string;
  roomname: string;
  members: Array<{
    id: string;
    email: string;
    username: string;
    isActive: boolean;
  }>;
  description: string;
  creator: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
  };
  isActive: boolean;
}
