import GameList from "../Games/GameList";
import { RiAddCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import InputFormGame from "../InputForms/InputFormGame";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function TournamentInfoGames() {
    const { user } = useAuth();
    const [addClicked, setAddClicked] = useState(false);
    const { id } = useParams();
    const teams = useSWR(`${HOST}/tournament_teams/?tournament_id=${id}`, (url) => fetch(url).then((res) => res.json()));
    const games = useSWR(`${HOST}/tournament_games/?tournament_id=${id}`, (url) => fetch(url).then((res) => res.json()));
    useEffect(
        () => { games.mutate() }, [addClicked]
    )
    return (
        <div className="h-fit flex flex-col w-full gap-4">
            {user && user.role == "admin" && <button className="w-fit flex flex-row self-end items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold " onClick={() => setAddClicked(true)}>
                {<RiAddCircleLine />} ADD GAME
            </button>}
            <GameList games={games.data} size="small" />
            {addClicked && <InputFormGame close={() => setAddClicked(false)} teams={teams.data} />}
            {addClicked && <div className="fixed inset-0 z-10 bg-black bg-opacity-50" ></div>}
        </div>)
}