import { useNavigate, useParams } from "react-router-dom";
import Main from "../Main";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/utils";
import { stringInitialLetters } from "@/helpers";
import _ from "lodash";
import { Button } from "../ui/button";
import { ArrowLeft, CornerDownLeft, MessageCircle } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useWindowDimensions from "@/custom_hooks/useWindowDimensions";
import api from "@/lib/axios";

type ToClientMessage = {
  action: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

type Movie = {
  id: number,
  title: string,
  backdrop_path: string,
  poster_path: string,
  release_date: string,
  overview: string,
  vote: number,
};

export default function Room() {
  const { id } = useParams();
  const { t }: ReturnType<typeof useTranslation> = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([
    _.pickBy(user, (_: string, key: string) => key !== "username") as User,
  ]);
  const { width } = useWindowDimensions();
  const [movieList, setMovieList] = useState<Movie[]>([]); // [1

  // Dentro do componente
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://" + import.meta.env.VITE_BACKEND_DOMAIN);

    ws.current.onopen = () => {
      // Test if the connection is open
      if (ws.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      ws.current?.send(JSON.stringify({ room: id, action: "join" }));
    };

    // Adicionar um manipulador de eventos para receber mensagens
    ws.current.onmessage = (event) => {
      const { action, data }: ToClientMessage = JSON.parse(event.data);
      if (action === "room_joined") {
        setUsersInRoom((users) => {
          // Adiciona apenas usuários que ainda não estão na lista
          const newUsers = data.users.filter(
            (newUser: User) =>
              users.findIndex((user) => user._id === newUser._id) === -1
          );
          return [...users, ...newUsers];
        });

        return;
      }

      if (action === "new_user_in_room") {
        setUsersInRoom((users) => {
          // Verifica se o novo usuário já está na lista
          if (
            users.findIndex((user) => user._id === data.new_user._id) !== -1
          ) {
            return users;
          }

          // Adiciona o novo usuário à lista
          return [...users, data.new_user];
        });

        return;
      }

      if (action === "user_left_room") {
        setUsersInRoom((users) =>
          // Remove o usuário que saiu da lista
          users.filter((user) => user._id !== data.user_left._id)
        );
      }

      if (action === "new_admin") {
        setIsAdmin(true);
      }

      if (action === "start") {
        setMovieList(data.movies);
      }
    };
  }, []);

  const leaveSocket = () => {
    if (ws.current) {
      ws.current.onclose = function () {}; // disable onclose handler first
      ws.current.close();
    }
  };

  const start = () => {
    api
      .get("room/start", {
        params: {
          room: id,
        },
      })
      .then((response) => {
        console.log(response);
      });
  };

  window.onbeforeunload = function () {
    leaveSocket();
  };

  return (
    <Main>
      <div className="flex w-[85%] h-full flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
          <div className="h-full grid gap-4 md:gap-8 lg:col-span-4 sm:grid-rows-5">
            <div className="h-full grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 row-span-1">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex gap-2 flex-wrap items-center">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {t("Room x", { id })}
                    </h4>
                  </CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed flex justify-end">
                    {isAdmin && <Button onClick={start}> {t("Start")} </Button>}
                  </CardDescription>
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader />
                <CardContent className="flex gap-x-4 flex-wrap">
                  {usersInRoom.map((user: User) => (
                    <Avatar key={user._id}>
                      <AvatarFallback>
                        {stringInitialLetters(user.nickname, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </CardContent>
                <CardFooter />
              </Card>
            </div>
            <Card className="min-h-fill sm:row-span-6">
              <CardHeader className="px-7">
                <CardTitle>asdasd</CardTitle>
                <CardDescription>asd</CardDescription>
              </CardHeader>
              <CardContent className="my-auto py-0">
                <Card className="h-[500px]">
                  <CardContent className="p-0">
                    {movieList.map((movie) => movie.title)}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          <Button
            className="absolute left-8"
            variant="outline"
            size="icon"
            onClick={() => {
              navigate("/");
              leaveSocket();
            }}
          >
            <ArrowLeft className="size-3.5" />
          </Button>

          {width > 1280 ? (
            <Card className="overflow-hidden w-full h-full mx-auto flex flex-col justify-end bg-muted/50 col-span-3 xl:col-span-1 sm:grid-rows-6">
              <CardContent className="p-6 text-sm">
                <Chat />
              </CardContent>
            </Card>
          ) : (
            <Sheet>
              <SheetTrigger className="absolute right-8">
                <Button variant="outline" size="icon">
                  <MessageCircle className="size-3.5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-hidden w-full h-full mx-auto flex flex-col justify-end">
                <Chat />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </Main>
  );
}

const Chat = () => {
  return (
    <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        <Button size="sm" className="ml-auto gap-1.5">
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};
