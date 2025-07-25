export type NoteTag =
  | "Work"
  | "Personal"
  | "Study"
  | "Other"
  | "Meeting"
  | "Shopping"
  | "Todo";

export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}
