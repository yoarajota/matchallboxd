import { Link } from "react-router-dom";
import Main from "../Main";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Settings, CirclePlus, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/utils";

export default function Menu() {
  const { t }: ReturnType<typeof useTranslation> = useTranslation();
  const { user } = useAuth();

  return (
    <Main>
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>{t("Hi!", { name: user?.nickname })}</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to="/oi"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CirclePlus className="h-4 w-4" />
              {t("New Room")}
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LogIn className="h-4 w-4" />
              {t("Join Room")}
            </Link>
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
