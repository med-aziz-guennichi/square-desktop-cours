import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldValues, UseFormReturn } from "react-hook-form";

interface SelectTypeProps {
  openType: boolean;
  setOpenType: (open: boolean) => void;
  index: number;
  form: UseFormReturn<FieldValues, object, FieldValues>;
  onSelect: (type: string) => void;
}

export function SelectType({ openType, setOpenType, index, form, onSelect }: SelectTypeProps) {
  const [selectedValue, setSelectedValue] = useState<string>("word");

  useEffect(() => {
    if (index !== null) {
      const formType = form.getValues(`chapters.${index}.typeDocument`);
      if (formType) {
        setSelectedValue(formType);
      }
    }
  }, [index, form]);

  const handleValueChange = (val: string) => {
    setSelectedValue(val);
    onSelect(val);
  };

  return (
    <Dialog open={openType} onOpenChange={setOpenType}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please select your type of document</DialogTitle>
          <DialogDescription>
            <div className="*:not-first:mt-2">
              <Select 
                value={selectedValue} 
                onValueChange={handleValueChange}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Choose a document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word">
                    Text Editor
                    <span className="text-muted-foreground mt-1 block text-xs">
                      Recommended for documents
                    </span>
                  </SelectItem>
                  <SelectItem value="excel">
                    Spreadsheet Editor
                    <span className="text-muted-foreground mt-1 block text-xs">
                      Recommended for spreadsheets
                    </span>
                  </SelectItem>
                  <SelectItem value="upload">
                    Upload file
                    <span className="text-muted-foreground mt-1 block text-xs">
                      PDF, Word, Excel files
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
