import WebSocket from "ws";
import RoomsModel from "../models/Rooms";
import _ from "lodash";

const rooms = {};

const userData = (user) =>
  _.pickBy(
    user._doc,
    (_, key) => key !== "password" && key !== "username"
  );

function useRoomActions(ws, request) {
  const join = ({ room }) => {
    if (!rooms[room]) {
      rooms[room] = new Set();
    }

    rooms[room].add(ws);

    const usersInRoom = [];
    rooms[room].forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const data = userData(client.user)

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

    return;
  };

  const leave = async ({ room }) => {
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

    return;
  };

  const wsLeaveRoom = () => {
    Object.keys(rooms).forEach((room) => {
      if (rooms[room].has(ws)) {
        leave({ room });
      }
    });
  };

  return { join, leave, wsLeaveRoom };
}

export default useRoomActions;
