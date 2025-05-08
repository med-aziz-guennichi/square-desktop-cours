"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Questions } from "./quizParametre"

export function QuestionPreview({ question, questionNumber }:{question:Questions,questionNumber:number}) {
  const [selectedOption, setSelectedOption] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

  const handleOptionSelect = (optionId:string) => {
    if (!showFeedback) {
      setSelectedOption(optionId)
    }
  }

  const handleVerify = () => {
    setShowFeedback(true)
  }

  const handleReset = () => {
    setSelectedOption("")
    setShowFeedback(false)
  }

  const isCorrect = selectedOption && question.options.find((opt) => opt.id === selectedOption)?.isCorrect

  return (
    <Card className="bg-[#252525] border-[#333] text-white overflow-hidden">
      <CardHeader className="bg-[#1e1e1e] border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333] text-sm">
            {questionNumber}
          </div>
          <h3 className="font-medium text-lg">{question.text || "Votre question ici..."}</h3>
        </div>
        {question.points > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            {question.points} point{question.points > 1 ? "s" : ""}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {question.options.length > 0 ? (
          <RadioGroup value={selectedOption} onValueChange={handleOptionSelect} className="space-y-3">
            {question.options.map((option, index) => {
              let className = "border border-[#444] p-3 rounded-md"

              if (showFeedback) {
                if (option.isCorrect) {
                  className += " bg-green-900/20 border-green-700"
                } else if (selectedOption === option.id && !option.isCorrect) {
                  className += " bg-red-900/20 border-red-700"
                }
              } else if (selectedOption === option.id) {
                className += " border-blue-500"
              }

              return (
                <div key={option.id} className={className}>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem
                      value={option.id}
                      id={`preview-${option.id}`}
                      className="mt-1 border-gray-500"
                      disabled={showFeedback}
                    />
                    <Label htmlFor={`preview-${option.id}`} className="flex-1 cursor-pointer">
                      {option.text || `Option ${index + 1}`}
                      {showFeedback && option.isCorrect && (
                        <span className="ml-2 text-xs text-green-400">(Réponse correcte)</span>
                      )}
                    </Label>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        ) : (
          <div className="text-gray-400 italic">Aucune option disponible</div>
        )}

        {showFeedback && question.explanation && (
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-md p-3 mt-4">
            <h4 className="text-sm font-medium text-blue-400 mb-1">Explication:</h4>
            <p className="text-sm text-blue-100">{question.explanation}</p>
          </div>
        )}

        {showFeedback && (
          <div className={`flex items-center gap-2 mt-4 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Bonne réponse !</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span>Mauvaise réponse</span>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {showFeedback ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="bg-transparent border-[#444] text-white hover:bg-[#333]"
            >
              Réessayer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!selectedOption}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Vérifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
