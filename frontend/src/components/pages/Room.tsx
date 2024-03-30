import { useParams } from "react-router-dom";
import Main from "../Main";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

export default function Room() {
  const { id } = useParams();
  const { t }: ReturnType<typeof useTranslation> = useTranslation();

  return (
    <Main>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>{t("Room x", { id })}</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed"></CardDescription>
                  </CardHeader>
                  <CardFooter></CardFooter>
                </Card>
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>{t("Room x", { id })}</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed"></CardDescription>
                  </CardHeader>
                  <CardFooter></CardFooter>
                </Card>
              </div>
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>asdasd</CardTitle>
                  <CardDescription>asdas</CardDescription>
                </CardHeader>
                <CardContent>asdasdas</CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden h-full">
              <CardHeader className="flex flex-row items-start bg-muted/50"></CardHeader>
              <CardContent className="p-6 text-sm">
                <Separator className="my-4" />
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3"></CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Main>
  );
}
