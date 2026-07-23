type UndoButtonProps = Readonly<{
  available: boolean;
  onUndo: () => void;
}>;

export function UndoButton({ available, onUndo }: UndoButtonProps) {
  const handleClick = () => {
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
        onClick={handleClick}
      >
        Deshacer jugada
      </button>
      {!available && <span className="undo-unavailable">No disponible</span>}
    </div>
  );
}
