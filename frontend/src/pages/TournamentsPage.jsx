import TournamentList from "../components/Tournaments/TournamentList";
import { RiAddCircleLine } from "react-icons/ri";
import { TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import InputFormTournament from "../components/InputForms/InputFormTournament";
import useSWR from "swr";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { HOST } from "../host";
export default function TournamentsPage() {
    const [addClicked, setAddClicked] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const tournaments = useSWR(`${HOST}/tournament/tournaments`, (url) => fetch(url).then((res) => res.json()));
    useEffect(
        () => { tournaments.mutate() }
        , [addClicked]);
    const { user } = useAuth();
    return (<div className="flex flex-col gap-10 px-10 py-4">
        <div className="flex flex-row  justify-between">
            {user && user.role == "admin" && <button onClick={() => setAddClicked(true)} className="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold text-base sm:text-lg md:text-2xl">
                {<RiAddCircleLine />} CREATE TOURNAMENT
            </button>}
            <TextField value={searchInput} onChange={(e) => setSearchInput(e.target.value)} label={<div className="flex flex-row gap-1 items-center"><FiSearch /><div>Search</div></div>} className="bg-white w-1/3 md:w-1/4 rounded" />
        </div>
        {addClicked && <InputFormTournament close={() => setAddClicked(false)} />}
        {addClicked && <div className="fixed inset-0 z-10 bg-black bg-opacity-50" ></div>}
        <TournamentList tournaments={tournaments} searchInput={searchInput} />
    </div>)
}