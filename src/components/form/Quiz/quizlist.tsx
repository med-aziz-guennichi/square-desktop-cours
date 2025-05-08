"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Eye, Copy, Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { mockQcmData } from "./mockQcmData"


export function QcmList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("tous")
  const [qcmData, setQcmData] = useState(mockQcmData)

  const filteredQcm = qcmData.filter((qcm) => {
    const matchesSearch =
      qcm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qcm.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "tous" || qcm.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteQcm = (id: string) => {
    setQcmData(qcmData.filter((qcm) => qcm.id !== id))
  }

  const handleDuplicateQcm = (id: string) => {
    const qcmToDuplicate = qcmData.find((qcm) => qcm.id === id)
    if (qcmToDuplicate) {
      const newQcm = {
        ...qcmToDuplicate,
        id: `${Date.now()}`,
        title: `${qcmToDuplicate.title} (copie)`,
        createdAt: new Date().toISOString(),
      }
      setQcmData([...qcmData, newQcm])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher un QCM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Toutes les catégories</SelectItem>
            <SelectItem value="informatique">Informatique</SelectItem>
            <SelectItem value="mathématiques">Mathématiques</SelectItem>
            <SelectItem value="sciences">Sciences</SelectItem>
            <SelectItem value="langues">Langues</SelectItem>
            <SelectItem value="histoire">Histoire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredQcm.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun QCM ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQcm.map((qcm) => (
            <Card key={qcm.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{qcm.title}</CardTitle>
                  <Badge
                    variant={
                      qcm.category === "informatique"
                        ? "default"
                        : qcm.category === "mathématiques"
                          ? "secondary"
                          : qcm.category === "sciences"
                            ? "destructive"
                            : qcm.category === "langues"
                              ? "outline"
                              : "default"
                    }
                  >
                    {qcm.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{qcm.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{qcm.questionCount} questions</span>
                  <span>Créé le {new Date(qcm.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Link href={`/qcm/${qcm.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </Link>
                  <Link href={`/qcm/${qcm.id}/modifier`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Button 
                   type="button"
                   size="sm" 
                   variant="ghost" 
                   onClick={() => handleDuplicateQcm(qcm.id)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Dupliquer</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement ce QCM et toutes ses
                          questions.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteQcm(qcm.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
