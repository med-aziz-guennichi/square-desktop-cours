"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Video,
  Users,
  User,
  School,
  Building,
  Filter,
  Play,
  CalendarPlus,
  History,
  Loader2,
  VideoIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

// Types
type UserRole = "student" | "teacher" | "parent" | "admin"
type ConferenceStatus = "scheduled" | "live" | "ended"
type ConferenceType = "class" | "individual" | "admin" | "mixed"

interface UserType {
  id: number
  name: string
  avatar: string
  role: UserRole
}

interface Conference {
  id: number
  title: string
  description?: string
  startTime: string
  endTime?: string
  status: ConferenceStatus
  type: ConferenceType
  host: UserType
  participants: UserType[]
  isRecorded: boolean
  roomCode: string
}

// Données fictives
const currentUser: UserType = {
  id: 1,
  name: "Jean Dupont",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "teacher",
}

const users: UserType[] = [
  currentUser,
  {
    id: 2,
    name: "Marie Laurent",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "teacher",
  },
  {
    id: 3,
    name: "Thomas Bernard",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "student",
  },
  {
    id: 4,
    name: "Sophie Martin",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "parent",
  },
  {
    id: 5,
    name: "Pierre Lefebvre",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
  },
]

const conferences: Conference[] = [
  {
    id: 1,
    title: "Cours de mathématiques avancées",
    description: "Séance de révision pour l'examen final",
    startTime: "2025-04-10T14:00:00",
    endTime: "2025-04-10T15:30:00",
    status: "scheduled",
    type: "class",
    host: users[0],
    participants: [users[2], users[3]],
    isRecorded: true,
    roomCode: "MATH-ADV-123",
  },
  {
    id: 2,
    title: "Réunion pédagogique",
    description: "Discussion sur les nouveaux programmes",
    startTime: "2025-04-09T10:00:00",
    endTime: "2025-04-09T11:30:00",
    status: "live",
    type: "admin",
    host: users[4],
    participants: [users[0], users[1]],
    isRecorded: true,
    roomCode: "ADMIN-PED-456",
  },
  {
    id: 3,
    title: "Tutorat individuel - Physique",
    description: "Aide personnalisée sur les concepts de mécanique quantique",
    startTime: "2025-04-09T16:00:00",
    status: "scheduled",
    type: "individual",
    host: users[0],
    participants: [users[2]],
    isRecorded: false,
    roomCode: "PHYS-TUT-789",
  },
  {
    id: 4,
    title: "Réunion parents-professeurs",
    description: "Bilan trimestriel",
    startTime: "2025-04-08T18:00:00",
    endTime: "2025-04-08T20:00:00",
    status: "ended",
    type: "mixed",
    host: users[0],
    participants: [users[3], users[4]],
    isRecorded: true,
    roomCode: "PARENT-MEET-101",
  },
]

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getConferenceTypeIcon = (type: ConferenceType) => {
  switch (type) {
    case "class":
      return <School className="h-4 w-4" />
    case "individual":
      return <User className="h-4 w-4" />
    case "admin":
      return <Building className="h-4 w-4" />
    case "mixed":
      return <Users className="h-4 w-4" />
    default:
      return <Video className="h-4 w-4" />
  }
}

const getConferenceTypeText = (type: ConferenceType) => {
  switch (type) {
    case "class":
      return "Classe"
    case "individual":
      return "Individuel"
    case "admin":
      return "Administration"
    case "mixed":
      return "Mixte"
    default:
      return "Conférence"
  }
}

const getStatusBadge = (status: ConferenceStatus) => {
  switch (status) {
    case "live":
      return (
        <Badge variant="destructive" className="ml-2">
          <Play className="h-3 w-3 mr-1 fill-current" />
          En direct
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="outline" className="ml-2">
          <Calendar className="h-3 w-3 mr-1" />
          Planifiée
        </Badge>
      )
    case "ended":
      return (
        <Badge variant="secondary" className="ml-2">
          <History className="h-3 w-3 mr-1" />
          Terminée
        </Badge>
      )
    default:
      return null
  }
}

// Composant principal
export default function ConferencePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [showNewConferenceDialog, setShowNewConferenceDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [isCreatingConference, setIsCreatingConference] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    onlyMine: false,
    onlyRecorded: false,
  })

  // Filtrer les conférences
  const filteredConferences = conferences.filter((conference) => {
    // Filtre de recherche
    const matchesSearch =
      searchQuery === "" ||
      conference.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conference.description && conference.description.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filtre par type
    const matchesType = filters.type === "all" || conference.type === filters.type

    // Filtre par propriétaire
    const matchesMine = !filters.onlyMine || conference.host.id === currentUser.id

    // Filtre par enregistrement
    const matchesRecorded = !filters.onlyRecorded || conference.isRecorded

    return matchesSearch && matchesType && matchesMine && matchesRecorded
  })

  // Trier les conférences par date
  const upcomingConferences = filteredConferences.filter((c) => c.status === "scheduled")
  const liveConferences = filteredConferences.filter((c) => c.status === "live")
  const pastConferences = filteredConferences.filter((c) => c.status === "ended")
  const myConferences = filteredConferences.filter((c) => c.host.id === currentUser.id)

  // Créer une nouvelle conférence
  const createNewConference = () => {
    setIsCreatingConference(true)

    // Simuler la création d'une conférence
    setTimeout(() => {
      setIsCreatingConference(false)
      setShowNewConferenceDialog(false)

      // Rediriger vers la page de la conférence
      navigate("/conference/1")
    }, 2000)
  }

  // Planifier une conférence
  const scheduleConference = () => {
    setIsCreatingConference(true)

    // Simuler la planification d'une conférence
    setTimeout(() => {
      setIsCreatingConference(false)
      setShowScheduleDialog(false)

      // Afficher un message de succès ou rediriger
      // Pour l'instant, on reste sur la page
    }, 2000)
  }

  return (
    <div className="p-8">
      <div className="container space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conférences</h1>
            <p className="text-muted-foreground">Gérez vos réunions et cours en ligne</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setShowNewConferenceDialog(true)}>
              <Play className="mr-2 h-4 w-4" />
              Démarrer maintenant
            </Button>
            <Button variant="outline" onClick={() => setShowScheduleDialog(true)}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Planifier
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </h3>

              <div className="space-y-2">
                <Label>Type de conférence</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="class">Classe</SelectItem>
                    <SelectItem value="individual">Individuel</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onlyMine"
                    checked={filters.onlyMine}
                    onCheckedChange={(checked) => setFilters({ ...filters, onlyMine: !!checked })}
                  />
                  <Label htmlFor="onlyMine">Mes conférences uniquement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onlyRecorded"
                    checked={filters.onlyRecorded}
                    onCheckedChange={(checked) => setFilters({ ...filters, onlyRecorded: !!checked })}
                  />
                  <Label htmlFor="onlyRecorded">Avec enregistrement</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="live">En direct</TabsTrigger>
                <TabsTrigger value="past">Passées</TabsTrigger>
                <TabsTrigger value="mine">Mes conférences</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingConferences.length === 0 ? (
                  <EmptyState
                    title="Aucune conférence à venir"
                    description="Planifiez une nouvelle conférence pour commencer"
                    action={() => setShowScheduleDialog(true)}
                    actionText="Planifier une conférence"
                  />
                ) : (
                  upcomingConferences.map((conference) => (
                    <ConferenceCard key={conference.id} conference={conference} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="live" className="space-y-4">
                {liveConferences.length === 0 ? (
                  <EmptyState
                    title="Aucune conférence en direct"
                    description="Démarrez une nouvelle conférence maintenant"
                    action={() => setShowNewConferenceDialog(true)}
                    actionText="Démarrer une conférence"
                  />
                ) : (
                  liveConferences.map((conference) => <ConferenceCard key={conference.id} conference={conference} />)
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastConferences.length === 0 ? (
                  <EmptyState
                    title="Aucune conférence passée"
                    description="L'historique de vos conférences apparaîtra ici"
                  />
                ) : (
                  pastConferences.map((conference) => <ConferenceCard key={conference.id} conference={conference} />)
                )}
              </TabsContent>

              <TabsContent value="mine" className="space-y-4">
                {myConferences.length === 0 ? (
                  <EmptyState
                    title="Vous n'avez pas encore de conférences"
                    description="Créez votre première conférence"
                    action={() => setShowScheduleDialog(true)}
                    actionText="Créer une conférence"
                  />
                ) : (
                  myConferences.map((conference) => <ConferenceCard key={conference.id} conference={conference} />)
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Dialogue pour démarrer une nouvelle conférence */}
        <Dialog open={showNewConferenceDialog} onOpenChange={setShowNewConferenceDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Démarrer une nouvelle conférence</DialogTitle>
              <DialogDescription>
                Créez une conférence instantanée et invitez des participants à la rejoindre.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la conférence</Label>
                <Input id="name" placeholder="Réunion de classe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type de conférence</Label>
                <Select defaultValue="class">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Classe entière</SelectItem>
                    <SelectItem value="individual">Individuel (1:1)</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="record" />
                <Label htmlFor="record">Enregistrer cette conférence</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewConferenceDialog(false)}>
                Annuler
              </Button>
              <Button onClick={createNewConference} disabled={isCreatingConference}>
                {isCreatingConference ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Démarrer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Planifier une conférence</DialogTitle>
              <DialogDescription>Programmez une conférence pour une date et une heure spécifiques.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="schedule-name">Nom de la conférence</Label>
                <Input id="schedule-name" placeholder="Réunion pédagogique" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input id="description" placeholder="Ordre du jour et objectifs de la réunion" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée</Label>
                <Select defaultValue="60">
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1 heure 30 minutes</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="custom">Personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-type">Type de conférence</Label>
                <Select defaultValue="class">
                  <SelectTrigger id="schedule-type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Classe entière</SelectItem>
                    <SelectItem value="individual">Individuel (1:1)</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="participants">Participants</Label>
                <Select>
                  <SelectTrigger id="participants">
                    <SelectValue placeholder="Sélectionnez des participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Professeurs</SelectLabel>
                      <SelectItem value="teacher-1">Marie Laurent</SelectItem>
                      <SelectItem value="teacher-2">Claire Dubois</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Étudiants</SelectLabel>
                      <SelectItem value="student-1">Thomas Bernard</SelectItem>
                      <SelectItem value="student-2">Lucas Moreau</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Administration</SelectLabel>
                      <SelectItem value="admin-1">Pierre Lefebvre</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Vous pouvez également inviter des participants après la création
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="schedule-record" />
                <Label htmlFor="schedule-record">Enregistrer cette conférence</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notify" defaultChecked />
                <Label htmlFor="notify">Envoyer des notifications aux participants</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Annuler
              </Button>
              <Button onClick={scheduleConference} disabled={isCreatingConference}>
                {isCreatingConference ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planification...
                  </>
                ) : (
                  <>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Planifier
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Composant pour afficher une carte de conférence
function ConferenceCard({ conference }: { conference: Conference }) {
  const navigate = useNavigate()
  const isLive = conference.status === "live"
  const isPast = conference.status === "ended"

  return (
    <Card className={cn("overflow-hidden transition-all", isLive && "border-destructive")}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center">
              {conference.title}
              {getStatusBadge(conference.status)}
            </CardTitle>
            <CardDescription>{conference.description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center">
            {getConferenceTypeIcon(conference.type)}
            <span className="ml-1">{getConferenceTypeText(conference.type)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatDate(conference.startTime)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {formatTime(conference.startTime)}
                {conference.endTime && ` - ${formatTime(conference.endTime)}`}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Hôte: {conference.host.name}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{conference.participants.length} participants</span>
              <div className="flex -space-x-2 ml-2">
                {conference.participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {conference.participants.length > 3 && (
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs">
                    +{conference.participants.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <div className="flex items-center">
          {conference.isRecorded && (
            <Badge variant="outline" className="mr-2">
              <VideoIcon className="h-3 w-3 mr-1" />
              Enregistrement
            </Badge>
          )}
          <Badge variant="outline">
            <span className="font-mono">{conference.roomCode}</span>
          </Badge>
        </div>
        <div className="flex gap-2">
          {isPast ? (
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Voir l&apos;enregistrement
            </Button>
          ) : (
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => navigate(`/conference/${conference.id}`)}
            >
              <Play className="mr-2 h-4 w-4" />
              {isLive ? "Rejoindre" : "Détails"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Composant pour afficher un état vide
function EmptyState({
  title,
  description,
  action,
  actionText,
}: {
  title: string
  description: string
  action?: () => void
  actionText?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
      <Video className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action && actionText && (
        <Button onClick={action}>
          <Plus className="mr-2 h-4 w-4" />
          {actionText}
        </Button>
      )}
    </div>
  )
}
