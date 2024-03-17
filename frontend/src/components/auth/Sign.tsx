import { useAuth } from "@/lib/auth";
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

export default function Sign({
  signin,
  signup,
}: {
  signin?: boolean;
  signup?: boolean;
}) {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const location: ReturnType<typeof useLocation> = useLocation();
  const auth: ReturnType<typeof useAuth> = useAuth();

  const from = location.state?.from?.pathname || "/";

  const formSchema = z.object(
    signin
      ? {
          email: z.string().email(),
          password: z.string().min(8),
        }
      : {
          username: z.string().min(2).max(50),
          email: z.string().email(),
          password: z.string().min(8),
        }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: signin
      ? {
          email: "",
          password: "",
        }
      : {
          username: "",
          email: "",
          password: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // auth.signin(username, () => {
    // Send them back to the page they tried to visit when they were
    // redirected to the Sign page. Use { replace: true } so we don't create
    // another entry in the history stack for the Sign page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the Sign page, which is also really nice for the
    // user experience.
    navigate(from, { replace: true });
    // });
  }

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{signin ? "Login" : "Registrar"}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {signin ? (
                <SiginFields form={form} />
              ) : (
                <SignupFields form={form} />
              )}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

const SiginFields = ({ form }: { form: any }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
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
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const SignupFields = ({ form }: { form: any }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
