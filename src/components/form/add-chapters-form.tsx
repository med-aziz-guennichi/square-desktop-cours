// components/form/chapters-form.tsx
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { X } from "lucide-react";

export const ChaptersForm = () => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "chapters" });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Contenu du cours</CardTitle>
                <CardDescription>Organisez votre cours en modules et leçons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold'>Chapitre {index + 1}</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="ml-2"
                                onClick={() => remove(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <FormField
                            control={control}
                            name={`chapters.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Titre du chapitre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`chapters.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description du chapitre..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`chapters.${index}.type`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border rounded p-2 w-full">
                                            <option value="">Sélectionner</option>
                                            <option value="lesson">Cours</option>
                                            <option value="quiz">Quiz</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`chapters.${index}.position`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() =>
                        append({
                            title: "",
                            description: "",
                            type: "lesson",
                            position: fields.length + 1,
                            studyMaterials: [],
                            quizzes: [],
                        })
                    }
                >
                    + Ajouter un chapitre
                </Button>
            </CardContent>
        </Card>
    );
};
