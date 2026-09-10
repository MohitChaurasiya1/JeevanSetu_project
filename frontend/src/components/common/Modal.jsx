import React, { useEffect, useRef } from 'react';

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
  className = '',
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open && onClose) {
        onClose();
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-xl shadow-xl border border-border overflow-hidden transform transition-all ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title && (
            <h3 id="modal-title" className="text-lg font-semibold text-text">
              {title}
            </h3>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-auto text-text-secondary hover:text-text p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-slate-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
