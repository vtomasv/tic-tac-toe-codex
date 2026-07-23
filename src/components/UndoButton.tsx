type UndoButtonProps = Readonly<{
  available: boolean;
  onUndo: () => void;
}>;

export function UndoButton({ available, onUndo }: UndoButtonProps) {
  const handlePointerUp = () => {
    if (available) {
      onUndo();
    }
  };

  return (
    <div className="undo-control">
      <button
        type="button"
        className="undo-button"
        aria-disabled={available ? undefined : 'true'}
        onPointerUp={handlePointerUp}
      >
        Deshacer jugada
      </button>
      {!available && <span className="undo-unavailable">No disponible</span>}
    </div>
  );
}
