import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { timeOf } from "../utils.js";

export default function ChatPane({ room, me, onSend, onTyping, onLeave, onMenu }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const listRef = useRef(null);
  const stickRef = useRef(true);
  const typingRef = useRef(0);

  // Keep scrolled to the bottom unless the reader scrolled up
  useEffect(() => {
    const el = listRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [room.messages.length]);

  const onScroll = () => {
    const el = listRef.current;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const submit = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    stickRef.current = true;
    onTyping(room.id, false);
    typingRef.current = 0;
    await onSend(room.id, t);
  };

  const onChange = (e) => {
    setText(e.target.value);
    const now = Date.now();
    if (now - typingRef.current > 2000) {
      typingRef.current = now;
      onTyping(room.id, true);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the code is visible anyway */
    }
  };

  const typers = Object.keys(room.typing);
  const typingText =
    typers.length === 0 ? "" : typers.length === 1 ? `${typers[0]} is typing…` : `${typers.join(", ")} are typing…`;

  return (
    <section className="chat">
      <header className="chat-head">
        <button className="icon menu-btn" onClick={onMenu} aria-label="Open rooms">☰</button>
        <div className="chat-title">
          <h2>{room.personal ? "🔒 " : "# "}{room.name}</h2>
          <button className="link" onClick={() => setShowMembers((s) => !s)}>
            {room.members.length} {room.members.length === 1 ? "member" : "members"}
          </button>
        </div>
        {room.personal && (
          <button className="code-chip" onClick={copyCode} title="Copy room code">
            {copied ? "Copied ✓" : <>Code: <b>{room.id}</b></>}
          </button>
        )}
        {room.personal && <button onClick={onLeave}>Leave</button>}
      </header>

      {showMembers && (
        <ul className="members">
          {room.members.map((m) => (
            <li key={m.id}>
              <Avatar name={m.name} size={24} /> {m.name}
              {m.id === me.id && <span className="muted"> (you)</span>}
              {room.owner === m.name && <span className="tag">owner</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="messages" ref={listRef} onScroll={onScroll}>
        {room.messages.length === 0 && <p className="empty muted">No messages yet. Say hi 👋</p>}
        {room.messages.map((m, i) => {
          if (m.system) return <div key={m.id} className="system">{m.text}</div>;
          const prev = room.messages[i - 1];
          const grouped = prev && !prev.system && prev.userId === m.userId && m.ts - prev.ts < 5 * 60 * 1000;
          const mine = m.userId === me.id;
          return (
            <div key={m.id} className={`msg ${mine ? "mine" : ""} ${grouped ? "grouped" : ""}`}>
              {!mine && (grouped ? <span className="avatar-gap" /> : <Avatar name={m.user} />)}
              <div className="bubble-col">
                {!grouped && (
                  <div className="meta">
                    {!mine && <b>{m.user}</b>}
                    <time>{timeOf(m.ts)}</time>
                  </div>
                )}
                <div className="bubble">{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="typing" aria-live="polite">{typingText}</div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          rows={1}
          maxLength={1000}
          placeholder={`Message ${room.personal ? "" : "#"}${room.name}`}
          value={text}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button className="primary" disabled={!text.trim()}>Send</button>
      </form>
    </section>
  );
}
