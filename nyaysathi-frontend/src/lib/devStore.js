function ensureStore() {
  if (!global.__nyaysathiDevStore) {
    global.__nyaysathiDevStore = {
      tasks: [],
      events: [],
      contacts: [],
      pdfs: [],
    };
  }
  return global.__nyaysathiDevStore;
}

function newId() {
  // good-enough unique id for dev fallback
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function devStore() {
  const store = ensureStore();

  return {
    list(collection) {
      return [...store[collection]];
    },

    create(collection, payload) {
      const item = { ...payload, _id: newId(), createdAt: new Date().toISOString() };
      store[collection].push(item);
      return item;
    },

    update(collection, id, patch) {
      const idx = store[collection].findIndex((x) => String(x._id) === String(id));
      if (idx === -1) return null;
      store[collection][idx] = { ...store[collection][idx], ...patch, updatedAt: new Date().toISOString() };
      return store[collection][idx];
    },

    remove(collection, id) {
      const before = store[collection].length;
      store[collection] = store[collection].filter((x) => String(x._id) !== String(id));
      return store[collection].length !== before;
    },

    find(collection, predicate) {
      return store[collection].find(predicate) || null;
    },
  };
}

