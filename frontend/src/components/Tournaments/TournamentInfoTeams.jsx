
import TournamentTeamList from "./TournamentTeamList";
import { RiAddCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import TeamSelectList from "../Other/TeamSelectList";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function TournamentInfoTeams() {
    const [addClicked, setAddClicked] = useState(false);
    const { id } = useParams();
    const selectTeams = useSWR(`${HOST}/team/teams`, (url) => fetch(url).then((res) => res.json()));
    const teams = useSWR(`${HOST}/tournament/tournament_teams/?tournament_id=${id}`, (url) => fetch(url).then((res) => res.json()));
    const teams_ids = teams.data ? teams.data.map((team) => team.id) : []
    const selectData = selectTeams.data ? selectTeams.data.filter((team) => !teams_ids.includes(team.id)) : [];
    const { user } = useAuth();

    useEffect(
        () => { teams.mutate() }
        , [addClicked]);
    return (<div className="h-fit flex flex-col w-full gap-4">
        {user && user.role == "admin" && <button className="w-fit flex flex-row self-end items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold " onClick={() => setAddClicked(true)}>
            {<RiAddCircleLine />} ADD TEAM
        </button>}
        <TournamentTeamList teams={teams} />
        {addClicked && <TeamSelectList teams={selectData} close={() => setAddClicked(false)} adder={true} tournament_id={id} />}
    </div>)
}