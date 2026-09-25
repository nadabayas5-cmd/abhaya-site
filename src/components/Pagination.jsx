import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Premium Atelier Pagination Component
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Active 1-indexed page
 * @param {number} props.totalItems - Total count of matching items
 * @param {number} props.pageSize - Items per page
 * @param {Function} props.onPageChange - Callback when page changes (newPage: number) => void
 * @param {Function} [props.onPageSizeChange] - Optional callback when page size changes
 * @param {Array<number>} [props.pageSizeOptions] - Optional page size choices e.g. [12, 24, 36]
 * @param {string} [props.itemLabel] - Label for items e.g. 'creations', 'products', 'items'
 * @param {boolean} [props.showPageSize] - Whether to show the per-page selector dropdown
 * @param {string} [props.className] - Extra wrapper classes
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 12,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 16, 24, 36],
  itemLabel = 'creations',
  showPageSize = true,
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Compute item range for display
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate pagination items with smart ellipsis
  const paginationRange = useMemo(() => {
    const delta = 1; // Number of pages around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'dots-left');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('dots-right', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Deduplicate in case totalPages is 1
    return Array.from(new Set(rangeWithDots));
  }, [currentPage, totalPages]);

  if (totalItems <= 0) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-stone-200/80 text-xs text-stone-700 font-sans ${className}`}
    >
      {/* 1. Item Count Summary */}
      <div className="text-[11px] sm:text-xs text-stone-500 font-semibold tracking-wider uppercase order-2 sm:order-1">
        Showing <span className="font-bold text-[#1E141B]">{startItem}–{endItem}</span> of{' '}
        <span className="font-bold text-[#1E141B]">{totalItems}</span> {itemLabel}
      </div>

      {/* 2. Pagination Controls (Center/Right) */}
      <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
        
        {/* First Page Button (Desktop) */}
        {totalPages > 4 && (
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-none border transition-colors cursor-pointer ${
              currentPage === 1
                ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
                : 'border-stone-300 text-stone-700 bg-white hover:border-[#7A0648] hover:text-[#7A0648]'
            }`}
            title="First page"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Previous Page Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-2.5 sm:px-3 h-8 rounded-none border text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            currentPage === 1
              ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
              : 'border-stone-300 text-stone-700 bg-white hover:border-[#7A0648] hover:text-[#7A0648]'
          }`}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {paginationRange.map((item, idx) => {
            if (item === 'dots-left' || item === 'dots-right') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-8 flex items-center justify-center text-stone-400 font-bold select-none text-xs"
                >
                  •••
                </span>
              );
            }

            const pageNumber = item;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-8 h-8 rounded-none border text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7A0648] border-[#7A0648] text-white shadow-xs'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400 hover:text-[#1E141B]'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-2.5 sm:px-3 h-8 rounded-none border text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            currentPage === totalPages
              ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
              : 'border-stone-300 text-stone-700 bg-white hover:border-[#7A0648] hover:text-[#7A0648]'
          }`}
          aria-label="Go to next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page Button (Desktop) */}
        {totalPages > 4 && (
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-none border transition-colors cursor-pointer ${
              currentPage === totalPages
                ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
                : 'border-stone-300 text-stone-700 bg-white hover:border-[#7A0648] hover:text-[#7A0648]'
            }`}
            title="Last page"
            aria-label="Go to last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Optional Page Size Selector */}
      {showPageSize && onPageSizeChange && totalItems > pageSizeOptions[0] && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
            Per Page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-stone-300 text-stone-800 text-xs font-bold px-2 py-1 focus:outline-none focus:border-[#7A0648] cursor-pointer rounded-none"
            aria-label="Items per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}
