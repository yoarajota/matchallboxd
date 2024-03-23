import { useAuth } from "@lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

export default function Sign({
  signin,
  signup,
}: {
  signin?: boolean;
  signup?: boolean;
}) {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const location: ReturnType<typeof useLocation> = useLocation();
  const { t }: ReturnType<typeof useTranslation> = useTranslation()
  const auth: ReturnType<typeof useAuth> = useAuth();

  const from = location.state?.from?.pathname || "/";

  const formSchema = z.object(
    signin
      ? {
        username: z.string().min(2).max(50).trim(),
        password: z.string().min(8),
      }
      : {
        username: z.string().min(2).max(50).trim(),
        nickname: z.string().min(2).max(100),
        password: z.string().min(8),
      }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: signin
      ? {
        username: "",
        password: "",
      }
      : {
        username: "",
        nickname: "",
        password: "",
      },
  });

  const cb = () => {
    navigate(from, { replace: true });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (signin) {
      return auth.signin(values as User, cb)
    }

    return auth.signup(values as User, cb)
  }

  function footerButtonAction() {
    if (signin) {
      return navigate("/sign-up", { replace: true })
    }

    return navigate("/sign-in", { replace: true })
  }

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{signin ? t("Sign In") : t("Sign Up")}</CardTitle>
          <CardDescription>{signin ? t("Lorem In") : t("Lorem Up")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {signin ? (
                <SiginFields form={form} />
              ) : (
                <SignupFields form={form} />
              )}
              <Button type="submit">{t("Submit")}</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={footerButtonAction}
            variant="link">{signin ? t("New here? Sign up!") : t("Already has an account? Sign in!")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const SiginFields = ({ form }: { form: any }) => {
  const { t }: ReturnType<typeof useTranslation> = useTranslation()

  return (
    <>
      <FormField
        control={form.control}
        name="nickname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Nickname")}</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Password")}</FormLabel>
            <FormControl>
              <Input type="password" placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const SignupFields = ({ form }: { form: any }) => {
  const { t }: ReturnType<typeof useTranslation> = useTranslation()

  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Username")}</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>{t("Lorem Impsum")}.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nickname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Nickname")}</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>{t("Lorem Impsum")}.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Password")}</FormLabel>
            <FormControl>
              <Input type="password" placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>{t("Lorem Impsum")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
