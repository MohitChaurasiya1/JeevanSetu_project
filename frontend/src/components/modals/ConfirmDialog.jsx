import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      maxWidth="max-w-md"
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
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
