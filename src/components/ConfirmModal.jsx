function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel}></div>

      <div className="relative bg-surface border border-surface-border rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold text-purity-white mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-4">{message}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium border border-surface-border hover:bg-surface-border text-purity-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;