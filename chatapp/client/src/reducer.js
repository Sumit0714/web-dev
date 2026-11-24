// All chat state lives here: joined rooms, their messages, members, unread counts.
export const initialState = { rooms: {}, order: [], active: null };

const upsert = (state, room, patch) => {
  const prev = state.rooms[room.id];
  const next = {
    id: room.id,
    name: room.name,
    personal: room.personal,
    owner: room.owner,
    members: room.members ?? prev?.members ?? [],
    messages: prev?.messages ?? [],
    unread: prev?.unread ?? 0,
    typing: prev?.typing ?? {},
    ...patch,
  };
  return {
    ...state,
    rooms: { ...state.rooms, [room.id]: next },
    order: state.order.includes(room.id) ? state.order : [...state.order, room.id],
  };
};

export function reducer(state, action) {
  switch (action.type) {
    case "JOINED": {
      const s = upsert(state, action.room, { messages: action.history, unread: 0 });
      return { ...s, active: action.activate || !s.active ? action.room.id : s.active };
    }
    case "LEFT": {
      const { [action.id]: _gone, ...rooms } = state.rooms;
      const order = state.order.filter((id) => id !== action.id);
      return { rooms, order, active: state.active === action.id ? order[0] ?? null : state.active };
    }
    case "MESSAGE": {
      const room = state.rooms[action.msg.roomId];
      if (!room || room.messages.some((m) => m.id === action.msg.id)) return state;
      const typing = { ...room.typing };
      if (action.msg.user) delete typing[action.msg.user];
      const isActive = state.active === room.id;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [room.id]: {
            ...room,
            typing,
            messages: [...room.messages, action.msg],
            unread: isActive || action.msg.system ? room.unread : room.unread + 1,
          },
        },
      };
    }
    case "MEMBERS": {
      const room = state.rooms[action.roomId];
      if (!room) return state;
      return { ...state, rooms: { ...state.rooms, [room.id]: { ...room, members: action.members } } };
    }
    case "TYPING": {
      const room = state.rooms[action.roomId];
      if (!room) return state;
      const typing = { ...room.typing };
      if (action.isTyping) typing[action.user] = action.at;
      else if (action.onlyIfAt === undefined || typing[action.user] === action.onlyIfAt)
        delete typing[action.user];
      return { ...state, rooms: { ...state.rooms, [room.id]: { ...room, typing } } };
    }
    case "ACTIVATE": {
      const room = state.rooms[action.id];
      if (!room) return state;
      return { ...state, active: action.id, rooms: { ...state.rooms, [room.id]: { ...room, unread: 0 } } };
    }
    default:
      return state;
  }
}
