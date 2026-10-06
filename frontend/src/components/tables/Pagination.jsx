import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0 || totalPages <= 1) {
    return (
      <div className={`px-4 sm:px-6 py-3.5 border-t border-border bg-slate-50/70 flex items-center justify-between text-xs text-textSecondary ${className}`}>
        <span>Showing {totalCount} of {totalCount} records</span>
      </div>
    );
  }

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Generate pagination buttons
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <div className={`px-4 sm:px-6 py-3.5 border-t border-border bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-textSecondary ${className}`}>
      <div>
        Showing <span className="font-semibold text-text">{startRecord}</span> to{' '}
        <span className="font-semibold text-text">{endRecord}</span> of{' '}
        <span className="font-semibold text-text">{totalCount}</span> entries
      </div>

      <div className="flex items-center gap-1 self-center sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-white text-textSecondary hover:bg-slate-100 hover:text-text disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">
                ...
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2.5 rounded-lg font-medium text-xs transition-colors ${
                isCurrent
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'bg-white border border-border text-textSecondary hover:bg-slate-100 hover:text-text'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-white text-textSecondary hover:bg-slate-100 hover:text-text disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
