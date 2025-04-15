// src/components/form/add-cours-form.ts

export const addCoursForm = [
  {
    type: 'text',
    name: 'title',
    label: 'Titre du cours',
    placeholder: 'Ex: Développement Web Full Stack',
    required: true,
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Description',
    placeholder: 'Décrivez le contenu du cours...',
    required: true,
  },
  {
    type: 'array',
    name: 'chapters',
    label: 'Chapitres',
    itemStructure: [
      {
        type: 'text',
        name: 'title',
        label: 'Titre du chapitre',
        placeholder: 'Ex: Introduction',
        required: true,
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        placeholder: 'Ce chapitre couvre les bases...',
        required: false,
      },
      {
        type: 'select',
        name: 'type',
        label: 'Type',
        options: ['lesson', 'quiz', 'mixed'],
        required: true,
      },
      {
        type: 'number',
        name: 'position',
        label: 'Position',
        placeholder: 'Ex: 1',
        required: true,
      },
    ],
  },
] as const;
