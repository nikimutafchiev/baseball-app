import PlayerList from "../components/Players/PlayerList";
import { RiAddCircleLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import InputFormPlayer from "../components/InputForms/InputFormPlayer";
import { TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import useSWR from "swr";
import { useAuth } from "../AuthContext";
import { HOST } from "../host";
export default function PlayersPage() {
    const [addClicked, setAddClicked] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const players = useSWR(`${HOST}/player/players`, (url) => fetch(url).then((res) => res.json()));
    useEffect(
        () => { players.mutate() }, [addClicked]
    )
    const { user } = useAuth();
    return (
        <div className="flex flex-col px-10 py-4">
            <div className="flex flex-row  justify-between">
                {user && user.role == "admin" && <button className="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold text-base sm:text-lg md:text-2xl" onClick={() => setAddClicked(true)}>
                    {<RiAddCircleLine />} CREATE PLAYER
                </button>}
                <TextField value={searchInput} onChange={(e) => setSearchInput(e.target.value)} label={<div className="flex flex-row gap-1 items-center"><FiSearch /><div>Search</div></div>} className="bg-white w-1/3 md:w-1/4 rounded" />
            </div>
            {addClicked && <InputFormPlayer close={() => setAddClicked(false)} isEdit={false} />}
            {addClicked && <div className="fixed inset-0 z-10 bg-black bg-opacity-50" ></div>}
            <PlayerList players={players} searchInput={searchInput} />
        </div>)
}