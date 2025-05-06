import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CourseAccessPopup } from "./shared-course-access-popup"

export function AddCourseButton() {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsPopupOpen(true)}>Ajouter cours</Button>
            <CourseAccessPopup open={isPopupOpen} onOpenChange={setIsPopupOpen} />
        </>
    )
}
