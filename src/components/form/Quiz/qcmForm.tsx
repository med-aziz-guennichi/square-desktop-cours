"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save } from "lucide-react"
import { QuestionForm } from "./questionForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { QuestionList } from "./questionlist"
import { Questions, Quiz } from "./quizParametre"

export function QcmForm({ existingQcm }: { existingQcm: Quiz }) {
  const router = useNavigate()
  const [activeTab, setActiveTab] = useState("details")
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    level: "débutant",
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
  const handleEditQuestion = (original: Questions, updated: Questions) => {
    // remplace la question dans formData.questions
    const updatedQuestions = formData.questions.map(q =>
      q.id === original.id ? updated : q
    );
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleAddQuestion = (question: Questions) => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...question, id: `1` }],
    }))
    setShowQuestionForm(true)
  }

  const handleRemoveQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const handleMoveQuestion = (questionId: string, direction: string) => {
    const currentIndex = formData.questions.findIndex((q) => q.id === questionId)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === formData.questions.length - 1)
    ) {
      return
    }

    const newQuestions = [...formData.questions]
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const [movedQuestion] = newQuestions.splice(currentIndex, 1)
    newQuestions.splice(newIndex, 0, movedQuestion)

    setFormData((prev) => ({ ...prev, questions: newQuestions }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error(
        "Le titre du QCM est obligatoire",
      )
      return
    }

    if (formData.questions.length === 0) {
      toast(
        "Vous devez ajouter au moins une question",
      )
      setActiveTab("questions")
      return
    }

    // Ici, vous pourriez envoyer les données à votre API

    toast(
      existingQcm ? "Le QCM a été mis à jour avec succès" : "Le QCM a été créé avec succès",
    )

    // Redirection vers la page d'accueil
    setTimeout(() => router("/"), 1500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="details">Détails du QCM</TabsTrigger>
          <TabsTrigger value="questions">Questions ({formData.questions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">
                    Titre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Entrez le titre du QCM"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Décrivez brièvement ce QCM"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>


              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="button" onClick={() => setActiveTab("questions")} className="flex items-center gap-2">
              Continuer vers les questions
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {formData.questions.length > 0 && (
            <QuestionList
              questions={formData.questions}
              onRemove={handleRemoveQuestion}
              onMove={handleMoveQuestion}
              onEdit={handleEditQuestion} // <-- ajoute cette ligne
            />
          )}

          {showQuestionForm ? (
            <QuestionForm
              existingQuestion={undefined}
              onCancel={() => setShowQuestionForm(false)}
              onSave={handleAddQuestion}
            />) : (
            <Button
              type="button"
              variant="outline"
              className="w-full py-8 border-dashed flex items-center justify-center gap-2"
              onClick={() => setShowQuestionForm(true)}
            >
              <PlusCircle className="h-5 w-5" />
              Ajouter une nouvelle question
            </Button>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
              Retour aux détails
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer le QCM
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
