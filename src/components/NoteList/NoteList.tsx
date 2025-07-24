import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import css from "./NoteList.module.css";

interface NoteListProps {
  page: number;
  search: string;
}

function NoteList({ page, search }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    if (!id) {
      console.warn("Missing note ID for deletion");
      return;
    }
    mutation.mutate(id);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error message="Failed to load notes." />;
  if (!data || !Array.isArray(data.notes)) {
    return <Error message="Unexpected server response." />;
  }
  if (data.notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li key={note._id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
