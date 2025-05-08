"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Questions } from "./quizParametre"

export function QuestionForm({
    existingQuestion,
    onSave,
    onCancel,
  }: {
    existingQuestion?: Questions;
    onSave: (q: Questions) => void;
    onCancel: () => void;
  }) {
  const [question, setQuestion] = useState({
    id:existingQuestion?.id ||"",
    text: existingQuestion?.text || "",
    explanation: existingQuestion?.explanation || "",
    options: existingQuestion?.options ||[],
    type: existingQuestion?.type || "choix-unique",
    points: existingQuestion?.points || 1,

  })
  
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion((prev) => ({ ...prev, explanation: e.target.value }))
  }

  const handleOptionTextChange = (id: string, value: string) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt)),
    }))
  }

const handleCorrectOptionChange = (id: string) => {
  setQuestion((prev) => ({
    ...prev,
    options: prev.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === id,
    })),
  }))
}

  const addOption = () => {
    if (question.options.length >= 6) {
      toast("Vous ne pouvez pas ajouter plus de 6 options")
      return
    }

    setQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { id: `opt-${Date.now()}`, text: "", isCorrect: false }],
    }))
  }

  const removeOption = (id: string) => {
    if (question.options.length <= 2) {
      toast("Vous devez avoir au moins 2 options")
      return
    }
  
    const isCorrectOption = question.options.find((opt) => opt.id === id)?.isCorrect
  
    setQuestion((prev) => {
      const newOptions = prev.options.filter((opt) => opt.id !== id)
  
      if (isCorrectOption && newOptions.length > 0) {
        newOptions[0].isCorrect = true
      }
  
      return { ...prev, options: newOptions }
    })
  }

  const handleSubmit = () => {
    if (!question.text.trim()) {
      toast("Le texte de la question est obligatoire")
      return
    }

    const emptyOptions = question.options.some((opt) => !opt.text.trim())
    if (emptyOptions) {
      toast("Toutes les options doivent avoir un texte")
      return
    }

    onSave(question)
  }

  return (
    <Card>
      <div>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-text">
              Question <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="question-text"
              placeholder="Entrez le texte de votre question"
              value={question.text}
              onChange={handleQuestionTextChange}
              rows={2}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options de réponse</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ajouter une option
              </Button>
            </div>

            <RadioGroup
              value={question.options.find((opt) => opt.isCorrect)?.id}
              onValueChange={handleCorrectOptionChange}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor={option.id} className="sr-only">
                      Option {index + 1}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="h-8 w-8 text-destructive"
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

          <div className="space-y-2">
            <Label htmlFor="explanation">Explication (optionnelle)</Label>
            <Textarea
              id="explanation"
              placeholder="Expliquez pourquoi la réponse est correcte (sera affichée après la réponse)"
              value={question.explanation}
              onChange={handleExplanationChange}
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {existingQuestion ? "Mettre à jour" : "Ajouter"} la question
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
