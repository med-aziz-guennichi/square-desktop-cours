import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ClickedChapter } from '@/pages/cours/ajouter-cours';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileUploadCircularProgressDemo } from './upload-files';

export const ClickedShapterForm = ({
    clickedShapter,
    setClickedShapter,
}: {
    clickedShapter: ClickedChapter;
    setClickedShapter: (chapter: ClickedChapter) => void;
}) => {
    const form = useFormContext();
    const [selectedValue, setSelectedValue] = useState<string>('Video');

    useEffect(() => {
        if (clickedShapter.index !== null) {
            const formType = form.getValues(`chapters.${clickedShapter.index}.type`);

            // Avoid updating state if value is already in sync
            if (!formType) {
                form.setValue(`chapters.${clickedShapter.index}.type`, 'Video');
                setSelectedValue('Video');
            } else {
                setSelectedValue(formType);
            }
        }
    }, [clickedShapter.index, form]);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setClickedShapter({
                                    id: null,
                                    index: null,
                                    title: '',
                                    description: '',
                                    type: '',
                                    quizzes: [],
                                    studyMaterials: [],
                                    position: 0,
                                })
                            }
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <CardTitle className="font-semibold truncate overflow-hidden whitespace-nowrap max-w-[400px]">
                            Contenu du {form.watch('chapters')[clickedShapter.index!].title || 'Untitled'}
                        </CardTitle>
                    </div>
                    <div>
                        <Select value={selectedValue} onValueChange={(val) => {
                            setSelectedValue(val);
                            form.setValue(`chapters.${clickedShapter.index}.type`, val);
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={selectedValue} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="Video"
                                >
                                    Video
                                </SelectItem>
                                <SelectItem
                                    value="Document"
                                >
                                    Document
                                </SelectItem>
                                <SelectItem
                                    value="Quiz"
                                >
                                    Quiz
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CardDescription>Organisez votre cours en modules et leçons</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name={`chapters.${clickedShapter.index}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Introduction"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`chapters.${clickedShapter.index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Description du chapitre..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {selectedValue === 'Video' ? (
                    <FileUploadCircularProgressDemo
                        accept="video/*"
                        maxFiles={5}
                        index={clickedShapter.index!}
                        form={form}
                    />
                ) : selectedValue === 'Document' ? (
                    <FileUploadCircularProgressDemo
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.rtf"
                        maxFiles={10}
                        index={clickedShapter.index!}
                        form={form}
                    />
                ) : (
                    <></>
                )}
            </CardContent>
        </Card>
    );
};
