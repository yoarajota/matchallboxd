import { Link, useNavigate } from "react-router-dom";
import Main from "../Main";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Settings, CirclePlus, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/utils";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function Menu() {
  const { t }: ReturnType<typeof useTranslation> = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const newRoom = () => {
    api
      .post("room/create")
      .then((response: AxiosResponse) => {
        const { id } = response.data.data;

        navigate(`/room/${id}`);
      })
      .catch((error) => toast.error(error.response.message));
  };

  const goToRoom = () => {
    if (!code) {
      return toast.error(t("The code is required."));
    }

    // Request to test if the room exists
    api
      .get(`room/${code}`)
      .then(() => navigate(`/room/${code}`))
      .catch(() => toast.error(t("Room not found.")));
  };

  return (
    <Main>
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>{t("Hi!", { name: user?.nickname })}</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <a
              onClick={newRoom}
              className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CirclePlus className="h-4 w-4" />
              {t("New Room")}
            </a>

            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <LogIn className="h-4 w-4" /> {t("Join Room")}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("Join Room")}</DialogTitle>
                  <DialogDescription>
                    {t("Enter the code of the room you want to join.")}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="code" className="sr-only">
                      {t("Code")}
                    </Label>
                    <Input
                      id="code"
                      placeholder={t("Code")}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={goToRoom}>{t("Join")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              {t("Settings")}
            </Link>
          </nav>
        </CardContent>
      </Card>
    </Main>
  );
}
