import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { InputLabel } from '../ui/input-label';
import { ScrollArea } from '../ui/scroll-area';
export const AddChaptersSheet = ({
    sheetOpen,
    setSheetOpen,
    remove,
    fields,
    handleAddInput,
}: {
    sheetOpen: boolean;
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
    remove: (index: number) => void;
    fields: Record<string, unknown>[];
    handleAddInput: () => void;
}) => {
    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[60vh]">
                    <div className="grid gap-4 py-4 px-4">
                        {fields.map((_, index) => (
                            <div key={index} className="flex items-center">
                                <InputLabel
                                    key={index}
                                    id={'input-' + index}
                                    label={'Titre du chapitre'}
                                    type="text"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => remove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4">
                        <Button className="w-full" onClick={handleAddInput}>
                            Ajouter un chapitre
                        </Button>
                    </div>
                </ScrollArea>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
