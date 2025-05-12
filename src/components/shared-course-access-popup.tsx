'use client';

import { getAllClasses } from '@/apis/classes/query-slice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useUserStore } from '@/store/user-store';
import { Class } from '@/types/classe.interface';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CourseAccessPopup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useUserStore.getState().decodedUser;
  const id = user?.facility?.scholarityConfigId;
  const navigate = useNavigate();
  const { data: classesDisponibles, isError,isLoading } = useQuery({
    queryKey: ['classes-shared-cours', id],
    queryFn: () => getAllClasses(id!),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
  const [isPublic, setIsPublic] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<Class[]>([]);
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchSelected, setSearchSelected] = useState('');
  if (isError) {
    toast.error('Something went wrong');
  }
  if(isLoading) {
    return <div>Loading...</div>;
  }
  // Filtrer les classes disponibles en fonction de la recherche
  const filteredAvailableClasses = classesDisponibles?.filter(
    (classe: Class) =>
      !selectedClasses.some((c) => c._id === classe._id) &&
      classe.name!.toLowerCase().includes(searchAvailable.toLowerCase()),
  );

  // Filtrer les classes sélectionnées en fonction de la recherche
  const filteredSelectedClasses = selectedClasses?.filter((classe) =>
    classe.name!.toLowerCase().includes(searchSelected.toLowerCase()),
  );

  // Ajouter une classe à la sélection
  const addToSelection = (classe: Class) => {
    setSelectedClasses([...selectedClasses, classe]);
  };

  // Retirer une classe de la sélection
  const removeFromSelection = (classe: Class) => {
    setSelectedClasses(selectedClasses.filter((c) => c._id !== classe._id));
  };

  // Sélectionner toutes les classes
  const selectAll = () => {
    setSelectedClasses(classesDisponibles);
  };

  // Désélectionner toutes les classes
  const deselectAll = () => {
    setSelectedClasses([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cours public</DialogTitle>
          <DialogDescription className="text-base">
            Définissez si ce cours est public et quelles classes y ont accès
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Cours public</h3>
            <p className="text-gray-500">
              Ce cours sera accessible à d&apos;autres classes
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        {isPublic && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4">Classes ayant accès à ce cours</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Classes disponibles */}
              <div className="border rounded-lg p-4">
                <h4 className="text-xl font-bold mb-4">Classes disponibles</h4>
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10"
                    value={searchAvailable}
                    onChange={(e) => setSearchAvailable(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredAvailableClasses.map((classe: Class) => (
                    <div
                      key={classe._id}
                      className="flex items-center space-x-2 py-1 border-b"
                    >
                      <Checkbox
                        id={`available-${classe._id}`}
                        onCheckedChange={() => addToSelection(classe)}
                      />
                      <label
                        htmlFor={`available-${classe._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {classe.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes sélectionnées */}
              <div className="border rounded-lg p-4">
                <h4 className="text-xl font-bold mb-4">Classes sélectionnées</h4>
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10"
                    value={searchSelected}
                    onChange={(e) => setSearchSelected(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="flex items-center space-x-2 py-1 border-b">
                    <Checkbox
                      id="select-all"
                      checked={selectedClasses.length === classesDisponibles.length}
                      onCheckedChange={(checked) => {
                        if (checked) selectAll();
                        else deselectAll();
                      }}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      Sélectionner toutes
                    </label>
                  </div>

                  {filteredSelectedClasses.length > 0 ? (
                    filteredSelectedClasses.map((classe) => (
                      <div
                        key={classe._id}
                        className="flex items-center space-x-2 py-1 border-b"
                      >
                        <Checkbox
                          id={`selected-${classe._id}`}
                          checked={true}
                          onCheckedChange={() => removeFromSelection(classe)}
                        />
                        <label
                          htmlFor={`selected-${classe._id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {classe.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      Aucune classe sélectionnée
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons de navigation entre les colonnes */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={deselectAll}
                disabled={selectedClasses.length === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={selectAll}
                disabled={selectedClasses.length === classesDisponibles.length}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate(
                `ajouter-cours?${new URLSearchParams({
                  classes: selectedClasses.map((classe) => classe._id).join(','),
                }).toString()}`,
              );
            }}
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
