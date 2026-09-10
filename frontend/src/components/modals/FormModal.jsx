import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const FormModal = ({
  open = false,
  onClose,
  onSubmit,
  title = 'Form',
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  maxWidth = 'max-w-lg',
  children,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      maxWidth={maxWidth}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
      </form>
    </Modal>
  );
};

export default FormModal;
