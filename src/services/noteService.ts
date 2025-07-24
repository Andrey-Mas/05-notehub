import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalNotes: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  const response = await axiosInstance.get("/notes", { params });

  const fixedNotes = (response.data.notes as Array<Partial<Note>>).map(
    (note) => ({
      ...note,
      _id: note._id ?? (note as { id: string }).id,
    })
  ) as Note[];

  return {
    ...response.data,
    notes: fixedNotes,
  };
};

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response = await axiosInstance.post("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};
