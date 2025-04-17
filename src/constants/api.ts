const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINT = {
  SIGN_IN: `${BASE_URL}/login-desktop-vite`,
  ME: `${BASE_URL}/me`,
  LOGOUT: `${BASE_URL}/logout`,
  REFRESH_TOKEN: `${BASE_URL}/refresh-token`,
  CLASSES: `${BASE_URL}/training-company/classes/byRole`,
  MATIERES: `${BASE_URL}/training-company/subjects-by-class-and-role`,
  LESSONS: `${BASE_URL}/training-company/get-all-new-lessons`,
};
