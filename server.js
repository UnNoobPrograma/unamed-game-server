const http = require("http");
const socket = require("socket.io");

const { dispatch, subscribe } = require("./gameLogic");

const port = 5465;

const app = http.createServer(() => {});
const io = socket(app);

io.on("connection", (socket) => {
  subscribe((state) => {
    socket.broadcast.emit("SYNC", state);
  });

  socket.on("addPlayer", (player) => {
    dispatch({ type: "NEW_PLAYER", payload: player });
  });

  socket.on("playerTurn", (payload) => {
    dispatch({ type: "PLAY", payload });
  });

  socket.on("disconnect", () => {
    dispatch({ type: "DISCONNECT_PLAYER", payload: { id: socket.id } });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
