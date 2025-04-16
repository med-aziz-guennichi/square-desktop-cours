import { useSignIn } from '@/apis/login/query';
import { SignInFormSchema, SignInFormType } from '@/apis/login/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoke } from '@tauri-apps/api/core';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useState } from 'react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)
  const methods = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      macAddress: '',
      password: '',
    },
  });
  const { handleSubmit } = methods;

  const { mutate, isPending } = useSignIn();

  const onSubmit: SubmitHandler<SignInFormType> = async (data) => {
    const mac = await invoke<string>('get_mac');
    data.macAddress = mac;
    mutate(data);
  };
  return (
    <Form {...methods}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
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
                    <Input
                      placeholder="m@proservices-training-company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez une adresse e-mail valide. Elle sera utilisée pour vous
                    contacter.
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
                    <div className="relative">
                      <Input placeholder="**********" type={isVisible ? "text" : "password"} className="pe-9" {...field} />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isPending ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
