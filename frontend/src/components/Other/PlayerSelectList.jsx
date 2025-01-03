import PlayerSelect from "./PlayerSelect";
import { RiCloseCircleLine } from "react-icons/ri";
import { TextField } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
export default function PlayerSelectList(props) {
    const [searchInput, setSearchInput] = useState("");
    return (<><div className="flex flex-col bg-white h-4/5 overflow-y-auto py-2 px-4 fixed self-center z-20 rounded w-2/3">
        <div className="flex flex-row justify-between items-start">
            <TextField value={searchInput} onChange={(e) => setSearchInput(e.target.value)} label={<div className="flex flex-row gap-1 items-center"><FiSearch /><div>Search</div></div>} className="bg-white w-1/4 rounded" />
            <button className="" onClick={() => props.close()}><RiCloseCircleLine size={30} color="gray" /></button>
        </div>
        {props.players.filter((player) => player.firstName.toLowerCase().includes(searchInput.toLowerCase()) || player.lastName.toLowerCase().includes(searchInput.toLowerCase())).map((player) =>
            <PlayerSelect player={player} close={() => { props.close() }} />
        )}
        {props.players && props.players.length == 0 && <div> No players available!</div>}
    </div></>)
}