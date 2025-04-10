import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import {  SubmitHandler, useForm } from "react-hook-form";
import { SignInFormSchema, SignInFormType } from "@/apis/login/schema";
import { useSignIn } from "@/apis/login/query";
import { invoke } from "@tauri-apps/api/core";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";


export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const methods = useForm<SignInFormType>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
          email: '',
          macAddress: '',
          password: ''
        }
    });
    const {
        handleSubmit,
    } = methods;

    const { mutate, isPending } = useSignIn();

    const onSubmit: SubmitHandler<SignInFormType> = async (data) => {
        const mac = await invoke<string>("get_mac");
        data.macAddress = mac;
        mutate(data);
    };
    return (
        <Form {...methods}>
            <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={methods.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse e-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Entrez une adresse e-mail valide. Elle sera utilisée pour vous contacter.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">

                        <FormField
                            control={methods.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="**********" type="password" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        isPending ? (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        )
                    }

                </div>

            </form>
        </Form>
    )
}
