import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/common/Layout';
import NicknamePage from '../pages/NicknamePage';
import VotePage from '../pages/VotePage';
import VoteResultPage from '../pages/VoteResultPage';
import BombPage from '../pages/BombPage';
import RoulettePage from '../pages/RoulettePage';
import LadderPage from '../pages/LadderPage';
import FinalPage from '../pages/FinalPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <NicknamePage /> },
      { path: '/vote', element: <VotePage /> },
      { path: '/result', element: <VoteResultPage /> },
      { path: '/bomb', element: <BombPage /> },
      { path: '/roulette', element: <RoulettePage /> },
      { path: '/ladder', element: <LadderPage /> },
      { path: '/final', element: <FinalPage /> },
    ],
  },
]);
