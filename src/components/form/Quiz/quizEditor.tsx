"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Plus, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Questions } from "./quizParametre"
export function QuestionEditor({ question , onChange }: {question: Questions,   onChange: (updatedQuestion: Questions) => void;}) {
  const [activeTab, setActiveTab] = useState("contenu")

  const handleTextChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    onChange({ ...question, [name]: value })
  }

  const handleTypeChange = (value: string) => {
    // Adapter les options en fonction du type de question
    let updatedOptions = [...question.options]

    if (value === "vrai-faux") {
      updatedOptions = [
        { id: `opt-${Date.now()}-1`, text: "Vrai", isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: "Faux", isCorrect: false },
      ]
    } else if (value === "choix-multiple") {
      // Pour choix multiple, on garde les options mais on s'assure qu'au moins une est correcte
      if (!updatedOptions.some((opt) => opt.isCorrect)) {
        updatedOptions[0].isCorrect = true
      }
    } else {
      // Pour choix unique, on s'assure qu'une seule option est correcte
      const hasCorrect = updatedOptions.some((opt) => opt.isCorrect)
      updatedOptions = updatedOptions.map((opt, idx) => ({
        ...opt,
        isCorrect: !hasCorrect && idx === 0 ? true : hasCorrect && opt.isCorrect,
      }))
    }

    onChange({
      ...question,
      type: value,
      options: updatedOptions,
    })
  }

  const handlePointsChange = (e: { target: { value: string } }) => {
    const points = Number.parseInt(e.target.value, 10)
    if (!isNaN(points) && points > 0) {
      onChange({ ...question, points })
    }
  }

  const handleOptionTextChange = (optionId: string, text: string) => {
    const updatedOptions = question.options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt))
    onChange({ ...question, options: updatedOptions })
  }

  const handleCorrectOptionChange = (optionId: string) => {
    // Pour les questions à choix unique
    if (question.type !== "choix-multiple") {
      const updatedOptions = question.options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId,
      }))
      onChange({ ...question, options: updatedOptions })
    }
    // Pour les questions à choix multiple
    else {
      const updatedOptions = question.options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId ? !opt.isCorrect : opt.isCorrect,
      }))

      // S'assurer qu'au moins une option est correcte
      if (!updatedOptions.some((opt) => opt.isCorrect)) {
        toast("Au moins une option doit être correcte")
        return
      }

      onChange({ ...question, options: updatedOptions })
    }
  }

  const addOption = () => {
    if (question.options.length >= 6) {
      toast("Vous ne pouvez pas ajouter plus de 6 options")
      return
    }

    // Pour les questions vrai/faux, on ne peut pas ajouter d'options
    if (question.type === "vrai-faux") {
      toast("Vous ne pouvez pas ajouter d'options aux questions Vrai/Faux")
      return
    }

    const newOption = {
      id: `opt-${Date.now()}`,
      text: "",
      isCorrect: false,
    }

    onChange({
      ...question,
      options: [...question.options, newOption],
    })
  }

  const removeOption = (optionId: string) => {
    // Pour les questions vrai/faux, on ne peut pas supprimer d'options
    if (question.type === "vrai-faux") {
      toast.error("Vous ne pouvez pas supprimer d'options des questions Vrai/Faux")
      return
    }

    if (question.options.length <= 2) {
      toast.error("Vous devez avoir au moins deux options")
      return
    }

    // Vérifier si l'option à supprimer est la réponse correcte
    const isCorrectOption = question.options.find((opt) => opt.id === optionId)?.isCorrect

    const updatedOptions = question.options.filter((opt) => opt.id !== optionId)

    // Si l'option supprimée était la seule réponse correcte, définir la première option comme correcte
    if (isCorrectOption && !updatedOptions.some((opt) => opt.isCorrect)) {
      updatedOptions[0].isCorrect = true
    }

    onChange({ ...question, options: updatedOptions })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-[#252525]">
          <TabsTrigger value="contenu" className="data-[state=active]:bg-[#333] data-[state=active]:text-white">
            Contenu
          </TabsTrigger>
          <TabsTrigger value="options" className="data-[state=active]:bg-[#333] data-[state=active]:text-white">
            Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contenu" className="space-y-6">
          <div>
            <Label htmlFor="question-text" className="text-gray-300 mb-2 block">
              Question <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="question-text"
              name="text"
              value={question.text}
              onChange={handleTextChange}
              placeholder="Saisissez votre question ici..."
              className="bg-[#252525] border-[#444] text-white resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="question-explanation" className="text-gray-300 mb-2 block flex items-center gap-2">
              Explication
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#333] text-white border-[#444]">
                    <p>L&apos;explication sera affichée après que l&apos;utilisateur ait répondu à la question</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="question-explanation"
              name="explanation"
              value={question.explanation}
              onChange={handleTextChange}
              placeholder="Explication de la réponse correcte (optionnelle)"
              className="bg-[#252525] border-[#444] text-white resize-none"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="question-type" className="text-gray-300 mb-2 block">
                Type de question
              </Label>
              <Select value={question.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="question-type" className="bg-[#252525] border-[#444] text-white">
                  <SelectValue placeholder="Type de question" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#444] text-white">
                  <SelectItem value="choix-unique">Choix unique</SelectItem>
                  <SelectItem value="choix-multiple">Choix multiple</SelectItem>
                  <SelectItem value="vrai-faux">Vrai/Faux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question-points" className="text-gray-300 mb-2 block">
                Points
              </Label>
              <Input
                id="question-points"
                type="number"
                min="1"
                value={question.points}
                onChange={handlePointsChange}
                className="bg-[#252525] border-[#444] text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Options de réponse</Label>
              {question.type !== "vrai-faux" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-8 text-xs bg-transparent border-[#444] text-blue-400 hover:bg-[#333] hover:text-blue-300"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter une option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {question.type === "choix-multiple" ? (
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={option.isCorrect}
                        onCheckedChange={() => handleCorrectOptionChange(option.id)}
                        className="mt-1 border-[#444] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <div className="grid gap-1.5 flex-1">
                        <Label htmlFor={`option-${option.id}`} className="sr-only">
                          Option {index + 1}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                            className="flex-1 bg-[#252525] border-[#444] text-white"
                          />
                          {question.type !== "vrai-faux" && (
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
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={question.options.find((opt) => opt.isCorrect)?.id}
                  onValueChange={handleCorrectOptionChange}
                  className="space-y-3"
                >
                  {question.options.map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <RadioGroupItem
                        value={option.id}
                        id={`option-${option.id}`}
                        className="mt-1 border-[#444] text-blue-600"
                      />
                      <div className="grid gap-1.5 flex-1">
                        <Label htmlFor={`option-${option.id}`} className="sr-only">
                          Option {index + 1}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                            className="flex-1 bg-[#252525] border-[#444] text-white"
                          />
                          {question.type !== "vrai-faux" && (
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
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
