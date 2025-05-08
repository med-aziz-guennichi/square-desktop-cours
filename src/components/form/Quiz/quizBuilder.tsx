"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, Trash2, Copy, Eye, ArrowLeft, ArrowRight, Clock, CheckCircle, FileText } from "lucide-react"
import { QuestionEditor } from "./quizEditor"
import { QuestionPreview } from "./quizprevious"
import { toast } from "sonner"
import { Questions } from "./quizParametre"
import { useCreateQuizMutation } from "./hook/create-quiz"
import { useUserStore } from "@/store/user-store"
import { QuizSchemaType } from "./schemas/quiz-schema"
export function QuizBuilder() {
  const [activeTab, setActiveTab] = useState("edit")
  const [activeSidePanel, setActiveSidePanel] = useState("settings")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [quiz, setQuiz] = useState({
    title: "1",
    description: "",
      level: "débutant",
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 30,
      randomizeQuestions: false,
      showFeedback: true,
      showResults: true,
    questions: [
      {
        id: "1",
        text: "",
        explanation: "",
        type: "choix-unique",
        points: 1,
        options: [{ id: "opt-1-1", text: "", isCorrect: true }],
      },
    ],
  })

  const user = useUserStore.getState().decodedUser;
  const scholarityConfigId = user?.facility?.scholarityConfigId ?? "";
  const { mutate: createQuiz } = useCreateQuizMutation(scholarityConfigId)


  // Fonctions de gestion des questions
  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      text: "",
      explanation: "",
      type: "choix-unique",
      points: 1,
      options: [{ id: `opt-${Date.now()}-1`, text: "", isCorrect: true }],
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))

    // Sélectionner automatiquement la nouvelle question
    setCurrentQuestionIndex(quiz.questions.length)
  }

  const duplicateQuestion = (e: React.MouseEvent) => {
    // Prevent form submission (if it's inside a form)
    e.preventDefault()
  
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const duplicatedQuestion = {
      ...currentQuestion,
      id: `q-${Date.now()}`,
      text: `${currentQuestion.text} (copie)`,
      options: currentQuestion.options.map((opt) => ({
        ...opt,
        id: `opt-${Date.now()}-${opt.id.split("-").pop()}`,
      })),
    }
  
    const newQuestions = [...quiz.questions]
    newQuestions.splice(currentQuestionIndex + 1, 0, duplicatedQuestion)
  
    setQuiz((prev) => ({
      ...prev,
      questions: newQuestions,
    }))
  
    // Sélectionner la question dupliquée
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const removeQuestion = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
  
    if (quiz.questions.length <= 1) {
      toast("Vous devez avoir au moins une question");
      return;
    }
  
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== currentQuestionIndex),
    }));
  
    // Adjust current question index if necessary
    if (currentQuestionIndex >= quiz.questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, quiz.questions.length - 2));
    }
  };

  const updateQuestion = (updatedQuestion:Questions) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) => (index === currentQuestionIndex ? { ...q, ...updatedQuestion } : q)),
    }))
  }

  const navigateToQuestion = (index:number) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  // Fonctions de gestion des paramètres du quiz
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuiz((prev) => ({ ...prev, [name]: value }))
  }

  const handleSettingChange = (name: string, value: string | number | boolean) => {
    setQuiz((prev) => ({
      ...prev,
      [name]: value, // 👈 On modifie directement la propriété au niveau racine de quiz
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!quiz.title.trim()) {
      toast.error("Le titre du quiz est obligatoire")
      return
    }
  
    const incompleteQuestions = quiz.questions.some((q) => !q.text.trim())
    if (incompleteQuestions) {
      toast.error("Toutes les questions doivent avoir un texte")
      return
    }
  
    const incompleteOptions = quiz.questions.some((q) =>
      q.options.some((opt) => !opt.text.trim())
    )
    if (incompleteOptions) {
      toast.error("Toutes les options de réponse doivent avoir un texte")
      return
    }
  
    const totalScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    const passingThreshold = Math.round((quiz.passingScore / 100) * totalScore)
  
    const payload: QuizSchemaType = {
      title: quiz.title,
      description: quiz.description,
      instructor: user?._id || "UNKNOWN_INSTRUCTOR", // make sure user exists
      scholarityConfigId: scholarityConfigId,
      totalAttempts: quiz.maxAttempts,
      totalTimeTaken: quiz.timeLimit,
      successRate: passingThreshold,
      score: totalScore,
      questions: quiz.questions.map((q) => ({
        question: q.text,
        explanation: q.explanation,
        point: q.points,
        isboolean: q.type === "boolean",
        options: q.options.map((opt) => ({
          text: opt.text,
          correct: opt.isCorrect,
        })),
      })),
    }
  
    createQuiz(payload)
  }


  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      {/* Barre d'outils supérieure */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-[#333] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>

            <div className="flex-1">
              <Input
                name="title"
                value={quiz.title}
                onChange={handleInputChange}
                placeholder="Titre du quiz"
                className="bg-[#252525] border-[#333] text-white h-9 text-lg font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
              className="bg-transparent border-[#333] hover:bg-[#333] hover:text-white"
            >
              {activeTab === "edit" ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Éditer
                </>
              )}
            </Button>

            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="flex gap-6">
          {/* Panneau latéral */}
          <div className="w-64 shrink-0">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
              <div className="flex border-b border-[#333]">
                <button
                type="button"
                  onClick={() => setActiveSidePanel("settings")}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeSidePanel === "settings"
                      ? "bg-[#252525] text-blue-400"
                      : "text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300"
                  }`}
                >
                  Paramètres
                </button>
                <button
  type="button"  // This prevents accidental form submission
  onClick={() => setActiveSidePanel("questions")}
  className={`flex-1 py-3 px-4 text-sm font-medium ${
    activeSidePanel === "questions"
      ? "bg-[#252525] text-blue-400"
      : "text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300"
  }`}
>
  Questions
</button>
              </div>

              {activeSidePanel === "settings" && (
                <div className="p-4 space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm text-gray-400">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={quiz.description}
                      onChange={handleInputChange}
                      placeholder="Description du quiz"
                      rows={3}
                      className="bg-[#252525] border-[#333] text-white resize-none text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="level" className="text-sm text-gray-400">
                      Niveau
                    </Label>
                    <Select value={quiz.level} onValueChange={(value) => handleSettingChange("level", value)}>
                      <SelectTrigger id="level" className="bg-[#252525] border-[#333] text-white">
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

                  <div className="space-y-3">
                    <Label htmlFor="passingScore" className="text-sm text-gray-400">
                      Score de passage (%)
                    </Label>
                    <div className="relative">
                      <Input
                        id="passingScore"
                        type="number"
                        min="1"
                        max="100"
                        value={quiz.passingScore}
                        onChange={(e) => handleSettingChange("passingScore", Number.parseInt(e.target.value))}
                        className="bg-[#252525] border-[#333] text-white pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="maxAttempts" className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Tentatives autorisées
                    </Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      value={quiz.maxAttempts}
                      onChange={(e) => handleSettingChange("maxAttempts", Number.parseInt(e.target.value))}
                      className="bg-[#252525] border-[#333] text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timeLimit" className="text-sm text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Temps limite (minutes)
                    </Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="0"
                      value={quiz.timeLimit}
                      onChange={(e) => handleSettingChange("timeLimit", Number.parseInt(e.target.value))}
                      className="bg-[#252525] border-[#333] text-white"
                    />
                    <p className="text-xs text-gray-500">0 = pas de limite</p>
                  </div>

                  <Separator className="bg-[#333]" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="randomizeQuestions" className="text-sm text-gray-400 cursor-pointer">
                        Questions aléatoires
                      </Label>
                      <Switch
                        id="randomizeQuestions"
                        checked={quiz.randomizeQuestions}
                        onCheckedChange={(checked) => handleSettingChange("randomizeQuestions", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showFeedback" className="text-sm text-gray-400 cursor-pointer">
                        Afficher le feedback
                      </Label>
                      <Switch
                        id="showFeedback"
                        checked={quiz.showFeedback}
                        onCheckedChange={(checked) => handleSettingChange("showFeedback", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showResults" className="text-sm text-gray-400 cursor-pointer">
                        Afficher les résultats
                      </Label>
                      <Switch
                        id="showResults"
                        checked={quiz.showResults}
                        onCheckedChange={(checked) => handleSettingChange("showResults", checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSidePanel === "questions" && (
                <div className="p-4">
                  <Button
                   type="button"
                    onClick={addQuestion}
                    variant="outline"
                    className="w-full bg-transparent border-[#333] hover:bg-[#333] hover:text-white mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une question
                  </Button>

                  <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 custom-scrollbar">
                    {quiz.questions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-full text-left p-3 rounded-md flex items-start gap-3 transition-colors ${
                          index === currentQuestionIndex
                            ? "bg-[#252525] border border-blue-500/50"
                            : "bg-[#1e1e1e] border border-transparent hover:border-[#333]"
                        }`}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333] text-xs font-medium shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{question.text || "Question sans titre"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-transparent border-[#444] text-gray-400">
                              {question.type === "choix-unique"
                                ? "Choix unique"
                                : question.type === "choix-multiple"
                                  ? "Choix multiple"
                                  : "Vrai/Faux"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {question.points} pt{question.points > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zone principale */}
          <div className="flex-1">
            {activeTab === "edit" ? (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
                <div className="bg-[#252525] border-b border-[#333] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#333] text-sm font-medium">
                      {currentQuestionIndex + 1}
                    </div>
                    <h3 className="font-medium">
                      Question {currentQuestionIndex + 1} sur {quiz.questions.length}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                    type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Question précédente</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === quiz.questions.length - 1}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">Question suivante</span>
                    </Button>

                    <Separator orientation="vertical" className="h-6 mx-2 bg-[#444]" />

                    <Button
                    type="button"
                      variant="ghost"
                      size="sm"
                      onClick={duplicateQuestion}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      title="Dupliquer la question"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Dupliquer</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeQuestion}
                      disabled={quiz.questions.length <= 1}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      title="Supprimer la question"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <QuestionEditor question={currentQuestion} onChange={updateQuestion} />
                </div>

                {/* Pagination */}
                <div className="border-t border-[#333] p-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {quiz.questions.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => navigateToQuestion(index)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          index === currentQuestionIndex
                            ? "bg-blue-600 text-white"
                            : "bg-[#252525] text-gray-300 hover:bg-[#333]"
                        }`}
                        aria-label={`Aller à la question ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
                <div className="bg-[#252525] border-b border-[#333] p-3 flex items-center justify-between">
                  <h3 className="font-medium">Aperçu du quiz</h3>

                  <div className="flex items-center gap-1">
                    <Button
                    type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Question précédente</span>
                    </Button>

                    <span className="text-sm text-gray-400">
                      {currentQuestionIndex + 1} / {quiz.questions.length}
                    </span>

                    <Button
                    type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === quiz.questions.length - 1}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">Question suivante</span>
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <QuestionPreview
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                  />
                </div>

                {/* Pagination */}
                <div className="border-t border-[#333] p-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {quiz.questions.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => navigateToQuestion(index)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          index === currentQuestionIndex
                            ? "bg-blue-600 text-white"
                            : "bg-[#252525] text-gray-300 hover:bg-[#333]"
                        }`}
                        aria-label={`Aller à la question ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
