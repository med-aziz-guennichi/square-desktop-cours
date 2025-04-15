import { Input } from './input';

export const InputLabel = ({
  id,
  label,
  type,
}: {
  id: string;
  label: string;
  type: string;
}) => {
  return (
    <div className="group relative w-full">
      <label
        htmlFor={id}
        className="origin-start text-muted-foreground/70 group-focus-within:text-primary has-[+input:not(:placeholder-shown)]:text-primary absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
      >
        <span className="bg-card group-focus-within:bg-black inline-flex px-2">
          {label}
        </span>
      </label>
      <Input id={id} type={type} placeholder=" " className="h-12" />
    </div>
  );
};
