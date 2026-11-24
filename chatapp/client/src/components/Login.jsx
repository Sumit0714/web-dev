import { useState } from "react";

export default function Login({ connected, onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !connected) return;
    setBusy(true);
    const err = await onLogin(name);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <main className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">💬</div>
        <h1>Chatterbox</h1>
        <p className="muted">Pick a name and jump into the lobby, or start a private room for your friends.</p>
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          autoFocus
          maxLength={20}
          placeholder="e.g. Prabhat"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={!name.trim() || !connected || busy}>
          {connected ? "Start chatting" : "Connecting to server…"}
        </button>
      </form>
    </main>
  );
}
