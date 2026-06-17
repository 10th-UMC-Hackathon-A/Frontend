import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/common/Layout'
import NicknamePage from '../pages/NicknamePage'
import VotePage from '../pages/VotePage'
import VoteResultPage from '../pages/VoteResultPage'
import BombPage from '../pages/BombPage'
import RoulettePage from '../pages/RoulettePage'
import LadderPage from '../pages/LadderPage'
import FinalPage from '../pages/FinalPage'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <NicknamePage /> },
      { path: '/vote', element: <VotePage /> },
      { path: '/result', element: <VoteResultPage /> },
      { path: '/bomb', element: <BombPage /> },
      { path: '/roulette', element: <RoulettePage /> },
      { path: '/ladder', element: <LadderPage /> },
      { path: '/final', element: <FinalPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router