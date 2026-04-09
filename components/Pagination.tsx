"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageURL(page));
  };

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();
  const startItem = totalItems
    ? (currentPage - 1) * (itemsPerPage ?? 10) + 1
    : null;
  const endItem = totalItems
    ? Math.min(currentPage * (itemsPerPage ?? 10), totalItems)
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-1">
      {/* Items info */}
      {totalItems && (
        <span className="text-xs font-mono text-primary/50 uppercase tracking-widest whitespace-nowrap">
          Showing{" "}
          <span className="text-primary/80">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="text-primary/80">{totalItems}</span> titles
        </span>
      )}

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-[11px] font-semibold uppercase tracking-widest
            border border-white/[0.07] rounded
            text-primary/60 hover:text-success hover:border-success/40
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-primary/60 disabled:hover:border-white/[0.07]
            transition-all duration-200
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs text-primary/30 select-none"
              >
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`
                  w-8 h-8 rounded text-[12px] font-mono font-semibold
                  border transition-all duration-200
                  ${
                    currentPage === page
                      ? "bg-success/10 border-success/50 text-success shadow-[0_0_12px_rgba(0,255,150,0.08)]"
                      : "border-white/[0.07] text-primary/50 hover:text-primary hover:border-white/20"
                  }
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-[11px] font-semibold uppercase tracking-widest
            border border-white/[0.07] rounded
            text-primary/60 hover:text-success hover:border-success/40
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-primary/60 disabled:hover:border-white/[0.07]
            transition-all duration-200
          "
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
