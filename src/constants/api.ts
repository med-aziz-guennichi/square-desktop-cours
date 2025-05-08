const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINT = {
  SIGN_IN: `${BASE_URL}/login-desktop-vite`,
  ME: `${BASE_URL}/me`,
  LOGOUT: `${BASE_URL}/logout`,
  REFRESH_TOKEN: `${BASE_URL}/refresh-token`,
  CLASSES: `${BASE_URL}/training-company/classes/byRole`,
  ALL_CLASSES: `${BASE_URL}/training-company/get-all-classes`,
  MATIERES: `${BASE_URL}/training-company/subjects-by-class-and-role`,
  LESSONS: `${BASE_URL}/training-company/get-all-new-lessons-pagination`,
  SHARED_LESSONS: `${BASE_URL}/training-company/get-all-new-lessons-public`,
  ONELESSON: `${BASE_URL}/training-company/get-new-lesson`,
  PROGRESS: `${BASE_URL}/training-company/get-progress`,
  CHAPTER: `${BASE_URL}/training-company/get-chapter`,
  CHAPTER_PROGRESS: `${BASE_URL}/training-company/get-chapter-progress`,
  MARK_CHAPTER_COMPLETED: `${BASE_URL}/training-company/mark-chapter-completed`,
  DELETE_LESSON: `${BASE_URL}/training-company/delete-new-lesson`,
  //QUIZ ROUTES 
  CREATE_QUIZ: `${BASE_URL}/training-company/create-quiz`,
  allQuizzes: `${BASE_URL}/training-company/all-quizzes/`,
  GET_QUIZ: `${BASE_URL}/training-company/get-quiz`,
  UPDATE_QUIZ: `${BASE_URL}/training-company/update-quiz`,
  DELETE_QUIZ: `${BASE_URL}/training-company/delete-quiz`,

};
