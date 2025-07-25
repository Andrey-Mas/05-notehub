// src/App.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import css from "./App.module.css";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id: number) => {
    deleteNote(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Pagination
          currentPage={page}
          totalPages={data?.totalPages ?? 0}
          onPageChange={handlePageChange}
        />
        <button className={css.addButton} onClick={openModal}>
          Create note +
        </button>
      </div>

      {isLoading && <Loader />}
      {isError && <Error message="Failed to load notes." />}

      {!isLoading && !isError && data && data.notes?.length === 0 && (
        <p className={css.empty}>No notes found.</p>
      )}
      {!isLoading && !isError && data && data.notes?.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
