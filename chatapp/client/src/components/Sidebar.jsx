import Avatar from "./Avatar.jsx";

export default function Sidebar({ me, connected, rooms, activeId, onSelect, onCreate, onJoin }) {
  return (
    <aside className="sidebar">
      <header className="side-head">
        <h2>Chatterbox</h2>
        <span className={`dot ${connected ? "on" : "off"}`} title={connected ? "Connected" : "Offline"} />
      </header>

      <div className="side-actions">
        <button className="primary" onClick={onCreate}>+ New room</button>
        <button onClick={onJoin}>Join with code</button>
      </div>

      <nav className="room-list" aria-label="Rooms">
        {rooms.map((r) => (
          <button
            key={r.id}
            className={`room-item ${r.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(r.id)}
          >
            <span className="room-icon">{r.personal ? "🔒" : "#"}</span>
            <span className="room-name">{r.name}</span>
            {r.unread > 0 && <span className="badge">{r.unread}</span>}
          </button>
        ))}
      </nav>

      <footer className="me">
        <Avatar name={me.name} size={32} />
        <span>{me.name}</span>
      </footer>
    </aside>
  );
}
