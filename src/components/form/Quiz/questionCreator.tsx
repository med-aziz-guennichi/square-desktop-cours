"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Option, Questions } from "./quizParametre"

interface QuestionCreatorProps {
  question: Questions;
  onChange: (updatedQuestion: Questions) => void;
}

export function QuestionCreator({ question, onChange }: QuestionCreatorProps) {  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...question, [name]: value });
  }

  const handleTypeChange = (value: "choix-unique" | "choix-multiple" | "vrai-faux") => {
    onChange({ ...question, type: value });
  }

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value, 10);
    if (!isNaN(points) && points > 0) {
      onChange({ ...question, points });
    }
  }

  const handleOptionTextChange = (optionId: string, text: string) => {
    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    onChange({ ...question, options: updatedOptions });
  };

  const handleCorrectOptionChange = (optionId: string) => {
    const updatedOptions = question.options.map(opt => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }));
    onChange({ ...question, options: updatedOptions });
  };

  const addOption = () => {
    if (question.options.length >= 6) {
      toast.error("Vous ne pouvez pas ajouter plus de 6 options");
      return;
    }
  
    const newOption = {
      id: `opt-${Date.now()}`,
      text: "",
      isCorrect: false,
    };
  
    onChange({
      ...question,
      options: [...question.options, newOption],
    });
  };
  
  const removeOption = (optionId: string) => {
    if (question.options.length <= 1) {
      toast.error("Vous ne pouvez pas supprimer toutes les options");
      return;
    }
  
    const isCorrectOption = question.options.find(opt => opt.id === optionId)?.isCorrect;
  
    let updatedOptions = question.options.filter(opt => opt.id !== optionId);
  
    if (isCorrectOption && updatedOptions.length > 0) {
      updatedOptions = updatedOptions.map((opt, index) => ({
        ...opt,
        isCorrect: index === 0,
      }));
    }
  
    onChange({ ...question, options: updatedOptions });
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`question-type-${question.id}`} className="text-gray-400 text-sm mb-1 block">
            Type de question
          </Label>
          <Select value={question.type} onValueChange={handleTypeChange}>
            <SelectTrigger id={`question-type-${question.id}`} className="bg-[#252525] border-[#333] text-white">
              <SelectValue placeholder="Type de question" />
            </SelectTrigger>
            <SelectContent className="bg-[#252525] border-[#333] text-white">
              <SelectItem value="choix-unique">Choix unique</SelectItem>
              <SelectItem value="choix-multiple">Choix multiple</SelectItem>
              <SelectItem value="vrai-faux">Vrai/Faux</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`question-points-${question.id}`} className="text-gray-400 text-sm mb-1 block">
            Points
          </Label>
          <Input
            id={`question-points-${question.id}`}
            type="number"
            min="1"
            value={question.points}
            onChange={handlePointsChange}
            className="bg-[#252525] border-[#333] text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`question-text-${question.id}`} className="text-gray-400 text-sm mb-1 block">
          Question
        </Label>
        <Textarea
          id={`question-text-${question.id}`}
          name="text"
          value={question.text}
          onChange={handleTextChange}
          placeholder="Votre question ici..."
          className="bg-[#252525] border-[#333] text-white resize-none"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor={`question-explanation-${question.id}`} className="text-gray-400 text-sm mb-1 block">
          Explication
        </Label>
        <Textarea
          id={`question-explanation-${question.id}`}
          name="explanation"
          value={question.explanation}
          onChange={handleTextChange}
          placeholder="Enter text or type '/' for commands"
          className="bg-[#252525] border-[#333] text-white resize-none"
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-400 text-sm">Options</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addOption}
            className="h-8 text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Ajouter une option
          </Button>
        </div>

        <RadioGroup
          value={question.options.find((opt: { isCorrect: boolean }) => opt.isCorrect)?.id}
          onValueChange={handleCorrectOptionChange}
          className="space-y-3"
        >
       {question.options.map((option: Option, index: number) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`option-${option.id}`} className="border-gray-500 text-blue-500" />
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor={`option-${option.id}`} className="sr-only">
                  Option {index + 1}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    className="flex-1 bg-[#252525] border-[#333] text-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Supprimer l&apos;option</span>

                  </Button>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
