import { getMatieres } from "@/apis/matieres/query-slice";
import { CourseCard } from "@/components/cards/subject-card";
import SubjectCardSketlon from "@/components/sketlon/subject-card";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useScreenWidth } from "@/hooks/screen-size";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { Book, Users2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { cardVariants } from "@/constants/animations"

export default function MatierePage() {
  const { setSousPages } = useBreadcrumb();
  const { classeId } = useParams();
  const user = useUserStore.getState().decodedUser;
  const width = useScreenWidth();
  const isMediumScreen = width >= 769 && width <= 1434;
  const isMobile = useIsMobile();

  const { data, isLoading } = useQuery({
    queryKey: ["matieres", classeId, user?._id],  // Query key with dynamic params
    queryFn: () => getMatieres(classeId!, user?._id),  // The query function
    enabled: !!user?._id && !!classeId,  // Only fetch when user and classeId are available
  });
  useEffect(() => {
    setSousPages([
      { name: "classes", link: "/dashboard/classes", icon: <Users2 size={16} /> },
      { name: "matieres", link: "/matieres", icon: <Book size={16} /> }
    ]);
  }, []);
  return (
    <div className="container mx-auto py-10">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Liste des matieres</h1>
        </div>
      </div>

      <div className={cn(
        "grid grid-cols-3 gap-6",
        isMediumScreen && 'grid-cols-1 p-3',
        isMobile && "grid-cols-1",
      )}>
        <AnimatePresence mode="wait">
          {
            isLoading ? (
              <>
                {
                  [0, 1, 2, 3, 4, 5, 6].map((_, i) => (
                    <motion.div
                      key={i}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={cardVariants}
                      transition={{ duration: 0.3 }}
                    >
                      <SubjectCardSketlon />
                    </motion.div>
                  ))
                }
              </>
            ) : (
              <>
                {data?.map((matiere: any) => (
                  <motion.div
                    key={matiere?.subject?._id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={cardVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <CourseCard
                      key={matiere?.subject?._id}
                      id={matiere?.subject?._id}
                      title={matiere?.subject?.name}
                      instructor={{
                        name: matiere?.instructor?.firstName,
                        surname: matiere?.instructor?.lastName,
                        avatar: matiere?.instructor?.imageUrl
                      }}
                      description={"Étude approfondie du calcul différentiel, des limites, des dérivées et de leurs applications dans la résolution de problèmes d'optimisation."}
                      onShareClick={(id) => console.log(`Partager le cours ${id}`)}
                      onClick={(id) => console.log(id)}
                    />
                  </motion.div>
                ))}
              </>
            )
          }
        </AnimatePresence>
      </div>
    </div>
  )
}
