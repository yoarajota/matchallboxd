import { WebSocketServer } from "ws";
import passport from "../auth";
import { parse } from "cookie";
import useRoomActions from "./roomsActions";

const wss = new WebSocketServer({ clientTracking: false, noServer: true });

wss.on("connection", function connection(ws, request) {
  ws.user = request.user;

  const RoomActions = useRoomActions(ws, request);

  const allActions = { ...RoomActions };

  ws.on("message", async function message(message: string) {
    const messageObject = JSON.parse(message);

    const { action } = messageObject;

    await allActions[action](messageObject);
  });

  ws.on("close", () => {
    RoomActions.wsLeaveRoom();
  });
});

const wssUpgrade = async function upgrade(request, socket, head) {

  if (request.url.length > 5) {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const cookies = parse(requestUrl.searchParams.get('cookie'));
    request.cookies = cookies
  } else {
    const cookies = parse(request.headers.cookie || "");
    request.cookies = cookies;
  }

  console.log(request.cookies)

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      socket.destroy();
      return;
    }

    request.user = user;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  })(request, null, () => { });
};

export default wssUpgrade;
