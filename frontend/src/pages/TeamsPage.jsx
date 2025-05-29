import TeamList from "../components/Teams/TeamList";
import { RiAddCircleLine } from "react-icons/ri";
import { TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import InputFormTeam from "../components/InputForms/InputFormTeam";
import useSWR from "swr";
import { useAuth } from "../AuthContext";
import { HOST } from "../host";
export default function TeamsPage() {
    const [addClicked, setAddClicked] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const teams = useSWR(`${HOST}/team/teams`, (url) => fetch(url).then((res) => res.json()));
    useEffect(
        () => { teams.mutate() }
        , [addClicked]);
    const { user } = useAuth();
    return (<div className="flex flex-col px-10 py-4 gap-10">
        <div className="flex flex-row  justify-between">
            {user && user.role == "admin" && <button className="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold text-base sm:text-lg md:text-2xl" onClick={() => setAddClicked(true)}>
                {<RiAddCircleLine />} CREATE TEAM
            </button>}
            <TextField value={searchInput} onChange={(e) => { setSearchInput(e.target.value) }} label={<div className="flex flex-row gap-1 items-center"><FiSearch /><div>Search</div></div>} className="bg-white w-1/3 md:w-1/4 rounded" />
        </div>
        {addClicked && <InputFormTeam close={() => setAddClicked(false)} />}
        {addClicked && <div className="fixed inset-0 z-10 bg-black bg-opacity-50" ></div>}
        <TeamList teams={teams} searchInput={searchInput} />
    </div>)
}