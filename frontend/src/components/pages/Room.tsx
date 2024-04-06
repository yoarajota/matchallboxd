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
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useAuth } from "@/lib/utils";
import { formatDate, stringInitialLetters } from "@/helpers";
import _ from "lodash";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  CornerDownLeft,
  LoaderIcon,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useWindowDimensions from "@/custom_hooks/useWindowDimensions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import api from "@/lib/axios";
import { toast } from "sonner";

type ToClientMessage = {
  action: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

type Movie = {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote?: number;
};

type MovieList = {
  index?: number;
  movies: Movie[];
  matches?: number[];
  ended?: boolean;
};

type Message = {
  user: User;
  message: string;
};

const dispatchReducer = (
  state: MovieList,
  action: { key: string; payload: number | Movie[] | MovieList | number[] }
): MovieList => {
  if (action.key === "all") {
    return action.payload as MovieList;
  } else if (action.key === "matches") {
    return {
      ...state,
      ended: true,
      matches: action.payload as number[],
    };
  }

  return {
    ...state,
    [action.key]: action.payload,
  };
};

export default function Room() {
  const { id } = useParams();
  const { t, i18n }: ReturnType<typeof useTranslation> = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([
    _.pickBy(user, (_: string, key: string) => key !== "username") as User,
  ]);
  const { width } = useWindowDimensions();
  const [movieList, setMovieList] = useReducer(dispatchReducer, {
    index: 0,
    matches: [],
    ended: false,
    movies: [],
  });
  const [messages, setMessages] = useState<Message[]>([]);

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
        setMovieList({ key: "movies", payload: data.movies });
      }

      if (action === "end") {
        setMovieList({ key: "matches", payload: data.positiveVotes });
      }

      if (action === "new_message") {
        setMessages((messages) => [...messages, data as Message]);
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    setMessages((messages) => [
      ...messages,
      {
        user: _.pickBy(
          user,
          (_: string, key: string) => key !== "username"
        ) as User,
        message,
      },
    ]);

    ws.current?.send(
      JSON.stringify({
        room: id,
        action: "message",
        data: {
          message,
        },
      })
    );
  };

  const leaveSocket = () => {
    if (ws.current) {
      ws.current.onclose = function () {}; // disable onclose handler first
      ws.current.close();
    }
  };

  const start = () => {
    if (usersInRoom.length === 1) {
      toast(t("You need at least 2 users to start the room!"));

      return;
    }

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

  const vote = useCallback(
    (value: number) => {
      if (movieList.movies) {
        movieList.movies[movieList?.index ?? 0].vote = value;

        const newIndex = (movieList.index ?? 0) + 1;

        setMovieList({
          key: "all",
          payload: {
            movies: movieList.movies,
            index: (movieList.index ?? 0) + 1,
            matches: movieList.matches ?? [],
            ended: movieList.ended,
          } as MovieList,
        });

        if (newIndex === movieList.movies.length) {
          ws.current?.send(
            JSON.stringify({
              room: id,
              action: "user_end",
              data: {
                movies: movieList.movies,
              },
            })
          );
        }
      }
    },
    [id, movieList.ended, movieList.index, movieList.matches, movieList.movies]
  );

  window.onbeforeunload = function () {
    leaveSocket();
  };

  return (
    <Main>
      <div className="flex w-[85%] h-full flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
          <div className="h-full grid gap-4 md:gap-8 lg:col-span-5 grid-rows-5">
            <div className="h-full grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 row-span-1">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex gap-2 flex-wrap items-center">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {t("Room x", { id })}
                    </h4>
                  </CardTitle>
                  <div className="w-full flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(id as string);
                        toast(t("Room code copied!"));
                      }}
                    >
                      {" "}
                      {t("Copy room code")}{" "}
                    </Button>
                    {isAdmin && <Button onClick={start}> {t("Start")} </Button>}
                  </div>
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
            <Card className="min-h-fill row-span-2 sm:row-span-6 flex flex-col">
              <CardHeader className="px-7">
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              {(movieList?.index ?? 0) < (movieList.movies?.length ?? 0) && (
                <CardContent className="my-auto py-0">
                  <Card
                    className="h-[500px] flex align-center justify-center"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original${
                        movieList?.movies?.[movieList?.index ?? 0]
                          ?.backdrop_path
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <CardContent className="h-full w-full pt-6 flex items-end justify-between">
                      <img
                        src={`https://image.tmdb.org/t/p/original${
                          movieList?.movies?.[movieList?.index ?? 0].poster_path
                        }`}
                        alt={movieList?.movies?.[movieList?.index ?? 0]?.title}
                        className="shadow-lg object-cover h-full border border-secondary rounded-lg"
                      />

                      <Card className="ml-3 w-full flex items-center flex-col px-8 justify-between">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                          {movieList?.movies?.[movieList?.index ?? 0]?.title}
                        </h3>

                        <p className="leading-7 line-clamp-6">
                          {formatDate(
                            movieList?.movies?.[movieList?.index ?? 0]
                              ?.release_date,
                            i18n.language
                          )}
                        </p>

                        <p
                          className="leading-7 [&:not(:first-child)]:mt-3 line-clamp-6"
                          title={
                            movieList?.movies?.[movieList?.index ?? 0]?.overview
                          }
                        >
                          {movieList?.movies?.[movieList?.index ?? 0]?.overview}
                        </p>

                        <div className="flex gap-x-4 my-4">
                          <Button size="icon" onClick={() => vote(1)}>
                            <ThumbsUp />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => vote(0)}
                          >
                            <ThumbsDown />
                          </Button>
                        </div>
                      </Card>
                    </CardContent>
                  </Card>
                </CardContent>
              )}

              {movieList.movies.length > 0 &&
                (movieList?.index ?? 0) >= (movieList.movies?.length ?? 0) &&
                (!movieList.ended ? (
                  <CardContent className="py-0 flex-grow w-full flex items-center justify-center flex-col gap-y-8">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      {t("Waiting for the other users to finish voting!")}
                    </h3>
                    <LoaderIcon
                      className="w-12 h-12 text-primary animate-spin"
                      aria-label="loading"
                    ></LoaderIcon>
                  </CardContent>
                ) : (
                  <CardContent className="py-0 flex-grow w-full flex items-center justify-center flex-col gap-y-8">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      {t("Matches!")}
                    </h3>

                    <Carousel className="w-full max-w-xs">
                      <CarouselContent>
                        {(movieList?.movies ?? [])
                          .filter((movie) =>
                            movieList.matches?.includes(movie.id)
                          )
                          .map((movie, index) => (
                            <CarouselItem key={index}>
                              <Card
                                className="h-[500px] w-full"
                                style={{
                                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></Card>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>

                    <Button
                      variant="ghost"
                      onClick={() => navigate("/")}
                      size="lg"
                    >
                      {t("Go back to the home page")}
                    </Button>
                  </CardContent>
                ))}
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

          <Sheet>
            <SheetTrigger className="absolute right-8">
              <Button variant="outline" size="icon">
                <MessageCircle className="size-3.5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-hidden w-full h-full mx-auto flex flex-col justify-end">
              {messages.map((messageObject, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Avatar key={messageObject.user._id}>
                    <AvatarFallback>
                      {stringInitialLetters(messageObject.user.nickname, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <p>{messageObject.message}</p>
                </div>
              ))}
              <Chat sendMessage={sendMessage} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Main>
  );
}

const Chat = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
  const { t }: ReturnType<typeof useTranslation> = useTranslation();

  const [message, setMessage] = useState<string>("");

  return (
    <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <Label htmlFor="message" className="sr-only">
        {t("Message")}
      </Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex items-center p-3 pt-0">
        <Button
          size="sm"
          className="ml-auto gap-1.5"
          onClick={(e) => {
            e.preventDefault();
            sendMessage(message);
            setMessage("");
          }}
        >
          {t("Send message")}
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};
