"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Save, Clock, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { QuestionCreator } from "./questionCreator"

export interface Quiz {
    id: string,
   title : string ,
   description:string ,
   level : string,
   passingScore: number,
maxAttempts: number,
timeLimit: number,
questions: Questions[],
}
export interface Questions {
  id:string ,
  text : string ,
  explanation : string,
  type : string ,
  points : number ,
  options :  Option[],

}
export interface Option {
   id :string,
   text:string,
   isCorrect:boolean
}
export function QcmCreationForm() {
  const [formData, setFormData] = useState<Quiz>({
    id: "1",
    title: "",
    description: "",
    level: "débutant",  // Default level
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 30,
    questions: [
      {
        id: "q-1",
        text: "",
        explanation: "",
        type: "choix-unique",
        points: 1,
        options: [{ id: "opt-1-1", text: "", isCorrect: true }],
      },
    ],
  })

  const router = useNavigate()

  // État pour suivre la question actuellement sélectionnée
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0) // Explicitly set type to number

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    }
  }

  const handleLevelChange = (value: "débutant" | "intermédiaire" | "avancé" | "expert") => {
    setFormData((prev) => ({ ...prev, level: value }))
  }

  const handleQuestionChange = (questionId: string, updatedQuestion: Questions) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, ...updatedQuestion } : q)),
    }))
  }

  const addQuestion = () => {
    const newQuestion: Questions = {
      id: `q-${Date.now()}`,
      text: "",
      explanation: "",
      type: "choix-unique",
      points: 1,
      options: [{ id: `opt-${Date.now()}-1`, text: "", isCorrect: true }],
    }

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))

    // Sélectionner automatiquement la nouvelle question
    setCurrentQuestionIndex(formData.questions.length)
  }

  const removeQuestion = (questionId: string) => {
    if (formData.questions.length <= 1) {
      toast.error("Vous devez avoir au moins une question")
      return
    }

    const questionIndex = formData.questions.findIndex((q) => q.id === questionId)

    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))

    // Ajuster l'index de la question courante si nécessaire
    if (currentQuestionIndex >= formData.questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, formData.questions.length - 2))
    } else if (questionIndex < currentQuestionIndex) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < formData.questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Le titre du QCM est obligatoire")
      return
    }

    // Vérifier que toutes les questions ont un texte
    const incompleteQuestions = formData.questions.some((q) => !q.text.trim())
    if (incompleteQuestions) {
      toast("Toutes les questions doivent avoir un texte")
      return
    }

    // Vérifier que toutes les options ont un texte
    const incompleteOptions = formData.questions.some((q) => q.options.some((opt) => !opt.text.trim()))
    if (incompleteOptions) {
      toast("Toutes les options de réponse doivent avoir un texte")
      return
    }

    // Ici, vous pourriez envoyer les données à votre API

    toast("Le QCM a été créé avec succès")
    setTimeout(() => router("/"), 1500) // Redirection vers la page d'accueil
  }

  const currentQuestion = formData.questions[currentQuestionIndex]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations générales du QCM */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="title" className="text-white">
              Titre
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Titre du QCM"
              className="bg-[#1e1e1e] border-[#333] text-white"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description du QCM"
              rows={4}
              className="bg-[#1e1e1e] border-[#333] text-white resize-none"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="level" className="text-white">
              Niveau
            </Label>
            <Select value={formData.level} onValueChange={handleLevelChange}>
              <SelectTrigger id="level" className="bg-[#1e1e1e] border-[#333] text-white">
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
                <SelectItem value="débutant">Débutant</SelectItem>
                <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="avancé">Avancé</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="passingScore" className="text-white">
              Score de passage (%)
            </Label>
            <div className="relative">
              <Input
                id="passingScore"
                name="passingScore"
                type="number"
                min="1"
                max="100"
                value={formData.passingScore}
                onChange={handleNumberInputChange}
                className="bg-[#1e1e1e] border-[#333] text-white pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-400">Pourcentage minimum pour réussir le quiz</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="maxAttempts" className="text-white flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Tentatives autorisées
              </Label>
              <Input
                id="maxAttempts"
                name="maxAttempts"
                type="number"
                min="1"
                value={formData.maxAttempts}
                onChange={handleNumberInputChange}
                className="bg-[#1e1e1e] border-[#333] text-white"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="timeLimit" className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Temps limite (minutes)
              </Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="1"
                value={formData.timeLimit}
                onChange={handleNumberInputChange}
                className="bg-[#1e1e1e] border-[#333] text-white"
              />
            </div>
          </div>
        </div>

        {/* Éditeur de question */}
        <div>
          <Card className="bg-[#1e1e1e] border-[#333] text-white">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} / {formData.questions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="bg-transparent border-[#333] hover:bg-[#333] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === formData.questions.length - 1}
                  className="bg-transparent border-[#333] hover:bg-[#333] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  className="bg-transparent border-[#333] hover:bg-[#333] hover:text-white ml-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(currentQuestion.id)}
                  disabled={formData.questions.length <= 1}
                  className="bg-transparent border-[#333] hover:bg-[#333] text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <QuestionCreator
                question={currentQuestion}
                onChange={(updatedQuestion: Questions) => handleQuestionChange(currentQuestion.id, updatedQuestion)}
                />
            </CardContent>
          </Card>

          {/* Pagination numérotée avec 10 questions par ligne */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            {formData.questions.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigateToQuestion(index)}
                className={`w-8 h-8 flex items-center justify-center border ${
                  index === currentQuestionIndex
                    ? "border-blue-500 bg-[#252525] text-blue-500"
                    : "border-[#333] bg-[#1e1e1e] text-gray-300 hover:bg-[#252525]"
                } ${(index + 1) % 10 === 0 ? "mr-0" : ""}`}
                aria-label={`Aller à la question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le QCM
        </Button>
      </div>
    </form>
  )
}
