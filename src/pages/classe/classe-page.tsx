import { useQuery } from "@tanstack/react-query"
import { ClassCard } from "./components/classe-card"
import { instance } from "@/lib/axios"
import { API_ENDPOINT } from "@/constants/api"
import { useUserStore } from "@/store/user-store"

interface Instructor {
    id: string
    name: string
    surname: string
    avatar: string
}
export interface IClasseCard {
    id: string
    title: string
    instructors: Instructor[]
    period: {
        start: string
        end: string
    }
    students: {
        total: number
        genderDistribution: {
            male: number
            female: number
        }
    }
    coursesCount: number
}
async function getClasses(scholarityConfigId: string) {
    try {
        const response = await instance.get(`${API_ENDPOINT.CLASSES}/${scholarityConfigId}`);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}
export default function ClassePage() {
    const user = useUserStore.getState().decodedUser;
    console.log("user", user);
    const { data, error } = useQuery({ queryKey: ['classes'], queryFn: () => getClasses(user?.facility?.scholarityConfigId) });
    console.log("data : ", data, "error: ", error);
    // Sample class data with multiple instructors
    const classData = {
        id: "class-1",
        title: "Introduction à l'Informatique",
        instructors: [
            {
                id: "instr-1",
                name: "Marie",
                surname: "Dupont",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            {
                id: "instr-2",
                name: "Jean",
                surname: "Martin",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            {
                id: "instr-3",
                name: "Sophie",
                surname: "Bernard",
                avatar: "/placeholder.svg?height=40&width=40",
            },
        ],
        period: {
            start: "1 Sept 2023",
            end: "15 Déc 2023",
        },
        students: {
            total: 48,
            genderDistribution: {
                male: 28,
                female: 20,
            },
        },
        coursesCount: 12,
    }

    // Sample class with different data
    const classData2 = {
        id: "class-2",
        title: "Mathématiques Avancées",
        instructors: [
            {
                id: "instr-4",
                name: "Pierre",
                surname: "Leroy",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            {
                id: "instr-5",
                name: "Isabelle",
                surname: "Moreau",
                avatar: "/placeholder.svg?height=40&width=40",
            },
        ],
        period: {
            start: "5 Sept 2023",
            end: "20 Déc 2023",
        },
        students: {
            total: 36,
            genderDistribution: {
                male: 22,
                female: 14,
            },
        },
        coursesCount: 8,
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Informations des Classes</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ClassCard
                    {...classData}
                    onChatClick={() => console.log("Chat clicked")}
                    onEditClick={(id) => console.log("Edit clicked for", id)}
                    onDeleteClick={(id) => console.log("Delete clicked for", id)}
                />
                <ClassCard
                    {...classData2}
                    onChatClick={() => console.log("Chat clicked")}
                    onEditClick={(id) => console.log("Edit clicked for", id)}
                    onDeleteClick={(id) => console.log("Delete clicked for", id)}
                />
                <ClassCard
                    {...classData2}
                    onChatClick={() => console.log("Chat clicked")}
                    onEditClick={(id) => console.log("Edit clicked for", id)}
                    onDeleteClick={(id) => console.log("Delete clicked for", id)}
                />
            </div>
        </main>
    )
}