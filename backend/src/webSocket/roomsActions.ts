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

const userData = (user) =>
  _.pickBy(user._doc, (_, key) => key !== "password" && key !== "username");

function useRoomActions(ws = null, request = null) {
  const join = async ({ room }) => {
    if (!rooms[room]) {
      rooms[room] = new Set();
      ws.isAdmin = true;
      // Store in the room, the admin id
      await RoomsModel.updateOne({ _id: room }, { admin_id: request.user._id });

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

      // Find index of the user that left
      const index = arr.findIndex((client) => client === ws);

      // Give admin to the next one
      const nextAdmin: WebSocket = arr[index + 1];
      nextAdmin.isAdmin = true;

      await RoomsModel.updateOne(
        { _id: nextAdmin.user._id },
        { admin_id: request.user._id }
      );

      // Notify the next admin
      notifyAdmin(nextAdmin, room);
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
      await RoomsModel.findByIdAndDelete(room);

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

  const wsLeaveRoom = () => {
    Object.keys(rooms).forEach((room) => {
      if (rooms[room].has(ws)) {
        leave({ room });
      }
    });
  };

  return { join, leave, wsLeaveRoom, start };
}

export default useRoomActions;
