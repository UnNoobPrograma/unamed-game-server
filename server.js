const http = require("http");
const socket = require("socket.io");

const port = 5465;

const app = http.createServer(() => {});
const io = socket(app);
let players = [];

io.on("connection", (socket) => {
  let currentPlayer = null;

  socket.on("addPlayer", (player) => {
    currentPlayer = player;
    players.push(player);

    socket.broadcast.emit("newPlayer", player);
  });

  socket.on("playerTurn", (payload) => {
    socket.broadcast.emit("serverTurn", payload);
  });

  socket.on("disconnect", () => {
    players = players.filter((player) => player.id !== currentPlayer.id);
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
