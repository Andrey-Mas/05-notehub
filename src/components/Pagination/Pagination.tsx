import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
  search: string;
}

function Pagination({ currentPage, onPageChange, search }: PaginationProps) {
  const { data } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse,
    [string, number, string]
  >({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes({ page: currentPage, perPage: 12, search }),
    placeholderData: (previousData) => previousData,
  });

  if (!data || data.totalPages <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={(e) => onPageChange(e.selected + 1)}
      pageCount={data.totalPages}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      pageLinkClassName={css.page}
      activeLinkClassName={css.active}
      previousLinkClassName={css.page}
      nextLinkClassName={css.page}
      breakLinkClassName={css.page}
    />
  );
}

export default Pagination;
