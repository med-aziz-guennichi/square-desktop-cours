import { useState } from 'react';

export const useAddChaptersSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inputs, setInputs] = useState([{ title: '' }]);
  return {
    sheetOpen,
    setSheetOpen,
    inputs,
    setInputs,
  };
};
