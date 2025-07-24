import { useState } from "react";
import { useDebounce } from "use-debounce";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";

const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Скидаємо сторінку при новому пошуку
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchValue} onChange={handleSearchChange} />
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            search={debouncedSearch}
          />
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        <NoteList page={currentPage} search={debouncedSearch} />

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onSuccess={closeModal} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
