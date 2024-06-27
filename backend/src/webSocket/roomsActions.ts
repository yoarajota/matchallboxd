import WebSocket from "ws";
import RoomsModel from "../models/Rooms";
import _ from "lodash";

const rooms = {};

export const notifyAdmin = (wsClient, room) => {
  wsClient.send(
    JSON.stringify({
      room,
      action: "new_admin",
      data: {},
    })
  );
};

const allEnded = (room) => {
  let ended = true;

  console.log(rooms[room])

  rooms[room].forEach((client) => {
    console.log(client.ended)

    if (!client.ended) {
      ended = false;
    }
  });

  return ended;
};

const userData = (user) =>
  _.pickBy(user._doc, (_, key) => key !== "password" && key !== "username");

function useRoomActions(ws = null, request = null) {
  const join = async ({ room }) => {
    if (!rooms[room]) {
      rooms[room] = new Set();
      ws.isAdmin = true;
      // Atualizado para usar o método update do Sequelize
      await RoomsModel.update({ admin_id: request.user._id }, { where: { _id: room } });

      notifyAdmin(ws, room);
    }

    rooms[room].add(ws);

    const usersInRoom = [];

    rooms[room].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const data = userData(client.user);

        usersInRoom.push(data);

        client.send(
          JSON.stringify({
            room,
            action: "new_user_in_room",
            data: { new_user: userData(ws.user) },
          })
        );
      }
    });

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          action: "room_joined",
          data: {
            users: usersInRoom,
          },
        })
      );
    }
  };

  const leave = async ({ room }) => {
    if (ws.isAdmin && rooms[room].size > 1) {
      const arr = Array.from(rooms[room]);

      const index = arr.findIndex((client) => client === ws);
      const nextAdmin: WebSocket = arr[index + 1];

      if (nextAdmin) {
        nextAdmin.isAdmin = true;

        // Atualizado para usar o método update do Sequelize
        await RoomsModel.update({ admin_id: request.user._id }, { where: { _id: nextAdmin.user._id } });

        notifyAdmin(nextAdmin, room);
      }
    }

    rooms[room].delete(ws);

    rooms[room].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            room,
            action: "user_left_room",
            data: { user_left: request.user },
          })
        );
      }
    });

    if (rooms[room].size === 0) {
      // Atualizado para usar o método destroy do Sequelize
      await RoomsModel.destroy({ where: { _id: room } });

      delete rooms[room];
    }
  };

  const start = async ({ room, data }) => {
    rooms[room].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            room,
            action: "start",
            data,
          })
        );
      }
    });
  };

  const message = async ({ room, data }) => {
    rooms[room].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            room,
            action: "new_message",
            data: {
              message: data.message,
              user: userData(ws.user)
            },
          })
        );
      }
    });
  }

  const user_end = async ({ room, data }) => {
    ws.ended = data.movies;
    rooms[room].forEach((client) => {
      if (client === ws && client.readyState === WebSocket.OPEN) {
        client.ended = data.movies;
      }
    });

    if (allEnded(room)) {
      // Get the matched votes
      const positiveVotes = new Set([]);
      rooms[room].forEach((client) => {
        for (const movie of client.ended) {
          if (movie.vote) {
            positiveVotes.add(movie.id);
          } else {
            positiveVotes.delete(movie.id);
          }
        }
      });

      rooms[room].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              room,
              action: "end",
              data: {
                positiveVotes: Array.from(positiveVotes),
              },
            })
          );
        }
      });
    }
  };

  const wsLeaveRoom = () => {
    Object.keys(rooms).forEach((room) => {
      if (rooms[room].has(ws)) {
        leave({ room });
      }
    });
  };

  return { join, leave, wsLeaveRoom, start, user_end, message };
}

export default useRoomActions;