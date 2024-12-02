import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import ErrorPage from './pages/ErrorPage';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from './pages/TeamsPage';
import ProfilePage from './pages/ProfilePage';
import PlayerInfoPage from './pages/PlayerInfoPage';
import GameInfoPage from './pages/GameInfoPage';
const rooter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "schedule",
        element: <GamesPage />
      },
      {
        path: "players",
        element: <PlayersPage />,

      },
      {
        path: "players/:id",
        element: <PlayerInfoPage />
      },
      {
        path: "games/:id",
        element: <GameInfoPage />
      },
      {
        path: "teams",
        element: <TeamsPage />
      },
      {
        path: "profile",
        element: <ProfilePage />
      }
    ]
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={rooter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
