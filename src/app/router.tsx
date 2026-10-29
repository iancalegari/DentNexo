import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { AtlasView } from '@/features/atlas/AtlasView';
import { DentalAtlasView } from '@/features/dental/DentalAtlasView';
import { PathologiesView } from '@/features/pathologies/PathologiesView';
import { AnesthesiaView } from '@/features/anesthesia/AnesthesiaView';
import { ConnectionsView } from '@/features/connections/ConnectionsView';
import { QuizView } from '@/features/study/QuizView';
import { FavoritesNotesView } from '@/features/favorites/FavoritesNotesView';
import { SystemFocusView } from '@/features/systems/SystemFocusView';

import { RouteErrorElement } from '@/components/common/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="/atlas" replace />,
      },
      {
        path: 'atlas',
        element: <AtlasView />,
      },
      {
        path: 'dental',
        element: <DentalAtlasView />,
      },
      {
        path: 'skeletal',
        element: (
          <SystemFocusView
            systemType="skeletal"
            title="Esqueleto Craniofacial & Mandíbula"
            subtitle="Acidentes ósseos, processos alveolares e canais"
            initialStructureId="mandibula"
          />
        ),
      },
      {
        path: 'muscular',
        element: (
          <SystemFocusView
            systemType="muscular"
            title="Músculos da Mastigação"
            subtitle="Masseter, Temporal, Pterigóideo Lateral e Medial"
            initialStructureId="masseter"
          />
        ),
      },
      {
        path: 'nervous',
        element: (
          <SystemFocusView
            systemType="nervous"
            title="Inervação Trigeminal Orofacial"
            subtitle="Nervos Maxilar (V2), Alveolar Inferior, Lingual e Mentual"
            initialStructureId="nervo_alveolar_inferior"
          />
        ),
      },
      {
        path: 'vascular',
        element: (
          <SystemFocusView
            systemType="vascular"
            title="Vascularização Facial & Maxilar"
            subtitle="Artérias Maxilar, Facial e Alveolar Inferior"
            initialStructureId="arteria_maxilar"
          />
        ),
      },
      {
        path: 'periodontal',
        element: (
          <SystemFocusView
            systemType="oral_tissue"
            title="Gengiva, Língua & Tecidos Orais"
            subtitle="Língua, Úvula, Gengiva Inserida e Ligamento Periodontal"
            initialStructureId="gengiva_inserida"
          />
        ),
      },
      {
        path: 'pathologies',
        element: <PathologiesView />,
      },
      {
        path: 'anesthesia',
        element: <AnesthesiaView />,
      },
      {
        path: 'connections',
        element: <Navigate to="/atlas" replace />,
      },
      {
        path: 'quiz',
        element: <QuizView />,
      },
      {
        path: 'favorites',
        element: <FavoritesNotesView />,
      },
      {
        path: '*',
        element: <Navigate to="/atlas" replace />,
      },
    ],
  },
]);
