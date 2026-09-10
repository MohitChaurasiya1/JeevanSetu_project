import React from 'react';
import ConfirmDialog from './ConfirmDialog';

const DeleteModal = ({
  open = false,
  onClose,
  onDelete,
  itemName = 'item',
  loading = false,
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onDelete}
      title={`Delete ${itemName}`}
      message={`Are you sure you want to delete this ${itemName}? This action cannot be reversed.`}
      confirmLabel="Delete"
      variant="danger"
      loading={loading}
    />
  );
};

export default DeleteModal;
