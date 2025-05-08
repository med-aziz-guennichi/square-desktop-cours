"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { QuestionForm } from "./questionForm"
import { Questions } from "./quizParametre"

export function QuestionList({
    questions,
    onRemove,
    onMove,
    onEdit,
  }: {
    questions: Questions[];
    onRemove: (id: string) => void;
    onMove: (id: string, direction: "up" | "down") => void;
    onEdit: (original: Questions, updated: Questions) => void;
  }){
    
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
    const [editingQuestion, setEditingQuestion] = useState<Questions | null>(null)

    const toggleItem = (id: string) => {
      setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleEdit = (question: Questions) => {
    setEditingQuestion(question)
  }

  const handleSaveEdit = (updatedQuestion: Questions) => {
    if (editingQuestion) {
      onEdit(editingQuestion, updatedQuestion)
      setEditingQuestion(null)
    }
  }

  if (editingQuestion) {
    return (
      <QuestionForm
        existingQuestion={editingQuestion}
        onSave={handleSaveEdit}
        onCancel={() => setEditingQuestion(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
 {questions.map((question: Questions, index: number) => (
        <Collapsible
          key={question.id}
          open={!!openItems[question.id]}
          onOpenChange={() => toggleItem(question.id)}
          className="border rounded-lg"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between w-full p-4 h-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <span className="font-medium line-clamp-1">{question.text}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${openItems[question.id] ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Options:</h4>
                  <ul className="space-y-2">
                  {question.options.map((option: { id: string; text: string; isCorrect: boolean }) => (
                      <li
                        key={option.id}
                        className={`pl-4 border-l-2 ${option.isCorrect ? "border-green-500 text-green-600 font-medium" : "border-gray-200"}`}
                      >
                        {option.text}
                        {option.isCorrect && <span className="ml-2 text-xs">(Réponse correcte)</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {question.explanation && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Explication:</h4>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMove(question.id, "up")}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span className="sr-only">Monter</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMove(question.id, "down")}
                    //   disabled={index === question.option.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                      <span className="sr-only">Descendre</span>
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    {!onEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        className="h-8"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement cette question.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onRemove(question.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
