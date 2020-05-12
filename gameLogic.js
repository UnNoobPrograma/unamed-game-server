const initialTokens = 10;

const initialState = {
  players: [],
  rows: [
    { max: 1, tokens: 0 },
    { max: 2, tokens: 0 },
    { max: 3, tokens: 0 },
    { max: 4, tokens: 0 },
    { max: 5, tokens: 0 },
  ],
  gameState: "playing",
  currentPlayer: 0,
  log: [{ type: "green", text: "Ready to play!" }],
};

const subscribedCallbacks = [];

function updateLog(state, message) {
  state.log = [message, ...state.log];
}

let state = reducer(initialState, {});

function dispatch(payload) {
  state = reducer(state, payload);

  subscribedCallbacks.forEach((callback) => callback(state));
}

function subscribe(callback) {
  subscribedCallbacks.push(callback);
}

function reducer(state, { type, payload }) {
  console.info(type, payload);
  switch (type) {
    case "NEW_PLAYER": {
      const player = {
        id: payload.id,
        name: payload.name,
        tokens: initialTokens,
      };
      const newState = {
        ...state,
        players: [...state.players, player],
      };

      return {
        ...newState,
      };
    }
    case "DISCONNECT_PLAYER": {
      const { id } = payload;

      const newState = { ...state };

      newState.players = newState.players.filter(
        ({ id: playerId }) => id !== playerId
      );

      return newState;
    }
    case "PLAY": {
      const newState = { ...state, gameState: "playing" };
      const { players, rows, currentPlayer } = newState;
      const { id, row } = payload;

      const whoPlayed = players.find(({ id: playerId }) => playerId === id);

      const { name } = whoPlayed;

      updateLog(newState, { type: "green", text: `${name} played ${row}!` });

      let newTurn = currentPlayer + 1;

      if (newTurn > players.length - 1) {
        newTurn = 0;
      }

      const newRows = [...rows];
      const changeRow = newRows[row - 1];

      changeRow.tokens += 1;

      if (changeRow.tokens > changeRow.max) {
        whoPlayed.tokens += changeRow.max;

        updateLog(newState, {
          type: "red",
          text: `${name} took ${changeRow.max} tokens`,
        });

        changeRow.tokens = 0;
      } else {
        whoPlayed.tokens -= 1;

        if (whoPlayed.tokens === 0) {
          newState.gameState = "end";

          updateLog(newState, {
            type: "yellow",
            text: `${name} won!`,
          });
        }
      }

      whoPlayed.lastRow = row;

      const result = {
        ...newState,
        rows: newRows,
        currentPlayer: newTurn,
      };

      return result;
    }
    default:
      return state;
  }
}

module.exports = {
  dispatch,
  subscribe,
};
