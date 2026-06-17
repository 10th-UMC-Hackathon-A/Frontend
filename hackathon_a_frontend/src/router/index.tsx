import { createBrowserRouter } from 'react-router-dom';
import { NicknamePage } from '../pages/NicknamePage';
import { VotePage } from '../pages/VotePage';
import { VoteResultPage } from '../pages/VoteResultPage';
import { BombPage } from '../pages/BombPage';
import { RoulettePage } from '../pages/RoulettePage';
import { LadderPage } from '../pages/LadderPage';
import { FinalPage } from '../pages/FinalPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NicknamePage />,
  },
  {
    path: '/vote',
    element: <VotePage />,
  },
  {
    path: '/vote-result',
    element: <VoteResultPage />,
  },
  {
    path: '/bomb',
    element: <BombPage />,
  },
  {
    path: '/roulette',
    element: <RoulettePage />,
  },
  {
    path: '/ladder',
    element: <LadderPage />,
  },
  {
    path: '/final',
    element: <FinalPage />,
  },
]);
