import React, { useState } from "react";
import { CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";
import TextEditorTwo from "./cours/text-editor-two";
import { Trash } from "lucide-react";
type QuestionType = "single" | "multiple";

interface Question {
    id: number;
    questionText: string;
    explanation: string;
    type: QuestionType;
    options: string[];
    correctAnswers: number[];
    score: number;
}

const QuizBuilder: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);

    // Handle changes for question text, explanation, and options
    const handleQuestionChange = <K extends keyof Question>(
        index: number,
        field: K,
        value: Question[K]
    ) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };


    const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        const question = updated[qIndex];

        if (question.type === "single") {
            question.correctAnswers = [oIndex];
        } else {
            // Toggle for multiple choice
            const idx = question.correctAnswers.indexOf(oIndex);
            if (idx > -1) {
                question.correctAnswers.splice(idx, 1);
            } else {
                question.correctAnswers.push(oIndex);
            }
        }

        setQuestions(updated);
    };
    const handleDeleteOption = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.splice(oIndex, 1);
        // Remove oIndex from correctAnswers
        updated[qIndex].correctAnswers = updated[qIndex].correctAnswers
          .filter((i) => i !== oIndex)
          .map((i) => (i > oIndex ? i - 1 : i));
        setQuestions(updated);
      };

    const handleAddOption = (qIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.push("");
        setQuestions(updated);
    };
    const handleDeleteQuestion = (index: number) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
      };

    const handleAddQuestion = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevents the page from refreshing
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: "",
                explanation: "",
                type: "single",
                options: [""],
                score: 0,
                correctAnswers: [],
            },
        ]);
    };

    const handleTypeChange = (qIndex: number, value: QuestionType) => {
        const updated = [...questions];
        updated[qIndex].type = value;
        setQuestions(updated);
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-10">
            <CardTitle className="font-semibold truncate overflow-hidden whitespace-nowrap max-w-[400px]">
                Création de Quiz
            </CardTitle>

            {questions.map((question, qIndex) => (
                <div key={question.id} className="my-4 relative">
                <div className="my-4 flex flex-wrap items-center gap-6">
                        {/* Type de question */}
                        <Button
    variant="ghost"
    size="icon"
    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
    onClick={() => handleDeleteQuestion(qIndex)}
>
    <Trash className="w-5 h-5" />
</Button>
                        <FormItem>
                            <FormLabel className="text-white block mb-1">Type de question</FormLabel>
                            <Select
                                value={question.type}
                                onValueChange={(value: QuestionType) => handleTypeChange(qIndex, value)}
                            >
                                <SelectTrigger className="w-[180px] border border-gray-300 p-2 bg-gray-700 text-white">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Choix unique</SelectItem>
                                    <SelectItem value="multiple">Choix multiple</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>

                        {/* Score / Points */}
                        <div>
                            <Label className="text-white block mb-1 text-sm">Points</Label>
                            <Input
                                type="number"
                                min={1}
                                value={question.score}
                                onChange={(e) =>
                                    handleQuestionChange(qIndex, "score", parseInt(e.target.value, 10) || 1)
                                }
                                className="w-[100px] text-white bg-gray-700 border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="my-4">
                        <Label className="block text-white text-lg font-medium mb-2">Question</Label>
                        <Textarea
                            value={question.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                            placeholder="Votre question ici..."
                            className="w-full p-3 border rounded-md text-white bg-gray-700"
                        />
                    </div>

                    <div className="my-4">
                        <Label className="block text-white text-lg font-medium mb-2">Explication</Label>
                        <TextEditorTwo
                            value={question.explanation}
                            onChange={(newVal) => handleQuestionChange(qIndex, "explanation", newVal)}
                            height="300px"
                        />
                    </div>


                    <div className="space-y-3">
                        <Label className="block text-white text-base font-semibold">Options</Label>
                        
                        {question.options.map((option, oIndex) => (
                            
                            <div
                                key={oIndex}
                            >
       <div className="flex justify-between items-center mb-2">
  
</div>
                    
                                <div className="flex items-center space-x-2">
                                    {question.type === "single" ? (
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            checked={question.correctAnswers.includes(oIndex)}
                                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            checked={question.correctAnswers.includes(oIndex)}
                                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                        />
                                    )}
                                    <span className="text-sm text-white">Option {oIndex + 1}</span>
                                    <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700 ml-2"
        onClick={() => handleDeleteOption(qIndex, oIndex)}
    >
        <Trash className="w-4 h-4" />
    </Button>
                                </div>

                                <div className="text-sm">
                                    <TextEditorTwo
                                        value={option}
                                        onChange={(newVal) => handleOptionChange(qIndex, oIndex, newVal)}
                                        height="160px" // slightly smaller for responsiveness
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => handleAddOption(qIndex)}
                        >
                            + Ajouter une option
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button" // Prevents form submission
                variant="ghost"
                onClick={handleAddQuestion}
            >
                Ajouter une Question
            </Button>
        </div>
    );
};

export default QuizBuilder;
