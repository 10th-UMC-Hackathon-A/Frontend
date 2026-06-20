import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/common/Layout';
import NicknamePage from '../pages/NicknamePage';
import VotePage from '../pages/VotePage';
import VoteProgressPage from '../pages/VoteProgressPage';
import VoteResultPage from '../pages/VoteResultPage';
import BombPage from '../pages/BombPage';
import RoulettePage from '../pages/RoulettePage';
import LadderPage from '../pages/LadderPage';
import FinalPage from '../pages/FinalPage';
import DrawPage from '../pages/DrawPage';
import TermsPage from '../pages/TermsPage';
import ErrorPage from '../pages/ErrorPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <NicknamePage /> },
      { path: '/vote', element: <VotePage /> },
      { path: '/progress', element: <VoteProgressPage /> },
      { path: '/result', element: <VoteResultPage /> },
      { path: '/draw', element: <DrawPage /> },
      { path: '/bomb', element: <BombPage /> },
      { path: '/roulette', element: <RoulettePage /> },
      { path: '/ladder', element: <LadderPage /> },
      { path: '/final', element: <FinalPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);
