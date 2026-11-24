import { useState } from "react";

export default function RoomModal({ mode, onClose, onSubmit }) {
  const isCreate = mode === "create";
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isCreate && !value.trim()) return;
    setBusy(true);
    const err = await onSubmit(value);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <div className="modal-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3>{isCreate ? "Create a personal room" : "Join a room"}</h3>
        <p className="muted">
          {isCreate
            ? "You'll get a code to share. Anyone with the code can join."
            : "Enter the 6-character code your friend shared."}
        </p>
        <input
          autoFocus
          maxLength={isCreate ? 30 : 6}
          placeholder={isCreate ? "Room name (optional)" : "e.g. K7P2QX"}
          value={value}
          style={isCreate ? undefined : { textTransform: "uppercase", letterSpacing: "0.2em" }}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
        />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary" disabled={busy || (!isCreate && !value.trim())}>
            {isCreate ? "Create room" : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
