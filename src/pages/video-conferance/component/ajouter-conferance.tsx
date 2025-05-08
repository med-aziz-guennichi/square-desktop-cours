import { getClasses } from '@/apis/classes/query-slice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import { useUserStore } from '@/store/user-store';
import { Class } from '@/types/classe.interface';
import { IUser } from '@/types/user.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { meetSchema, MeetType } from './schema';

export default function AjouterConferance({
  showNewConferenceDialog,
  setShowNewConferenceDialog,
}: {
  showNewConferenceDialog: boolean;
  setShowNewConferenceDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedClasses, setSelectedClasses] = useState<Option[]>([]);
  const user = useUserStore.getState().decodedUser;
  const scholarityConfigId = user?.facility?.scholarityConfigId;
  const { data, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClasses(scholarityConfigId!, 1, 10000),
    enabled: !!scholarityConfigId,
  });

  const methods = useForm<MeetType>({
    resolver: zodResolver(meetSchema),
    defaultValues: {
      name: '',
      users: [],
    },
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<MeetType> = (data) => {
    console.warn(data);
  };
  return (
    <Dialog open={showNewConferenceDialog} onOpenChange={setShowNewConferenceDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Démarrer une nouvelle conférence</DialogTitle>
          <DialogDescription>
            Créez une conférence instantanée et invitez des participants à la
            rejoindre.
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormItem>
                        <FormLabel>Titre de la conférence</FormLabel>
                        <FormControl>
                          <Input placeholder="Réunion de classe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>
              <div className="grid gap-2">
                {isLoading ? (
                  <div>
                    <div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-primary animate-ping"></div>
                        <div className="h-4 w-4 rounded-full bg-primary animate-ping"></div>
                        <div className="h-4 w-4 rounded-full bg-primary animate-ping"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FormField
                    control={methods.control}
                    name="users"
                    render={() => (
                      <div className="grid gap-2">
                        <FormItem>
                          <FormLabel>Inviter des participants</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              commandProps={{
                                label: 'Select classes',
                              }}
                              onChange={(value) => {
                                setSelectedClasses(value); // update UI selection
                                const selectedStudentIds = value
                                  .flatMap((item) =>
                                    'students' in item &&
                                    Array.isArray(item.students)
                                      ? item.students.map((s: IUser) => s._id)
                                      : [],
                                  )
                                  .filter(
                                    (student): student is string =>
                                      typeof student === 'string',
                                  );
                                methods.setValue('users', selectedStudentIds); // update form value
                              }}
                              options={data.data.map((item: Class) => ({
                                label: item.name,
                                value: item._id,
                                students: item.students,
                              }))}
                              value={selectedClasses}
                              placeholder="Select classes"
                              hidePlaceholderWhenSelected
                              emptyIndicator={
                                <p className="text-center text-sm">
                                  No results found
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewConferenceDialog(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Démarrer</Button>
                {/* <Button onClick={createNewConference} disabled={isCreatingConference}>
                {isCreatingConference ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Démarrer
                  </>
                )}
              </Button> */}
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
