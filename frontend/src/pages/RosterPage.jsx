import { Link, useNavigate, useParams } from "react-router-dom";
import Roster from "../components/Roster/Roster";
import useSWR from "swr";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { HOST } from "../host";
export default function RosterPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const game = useSWR(`${HOST}/game/${id}`, (url) => fetch(url).then((res) => res.json()));
    const [rostersReady, setRostersReady] = useState([false, false]);
    const { token, logout } = useAuth();
    return (<>{
        game.data && <div className=" min-h-[90vh] flex flex-row justify-around p-2 ">
            <Link className="rounded font-semibold bg-accent_2 hover:bg-accent_3 text-white drop-shadow-lg h-fit p-2" to={-1} >Back</Link>
            <Roster team={game.data.homeTeam} tournament={game.data.tournament} homeAway="HOME" rosterReady={(isReady) => { if (isReady) setRostersReady([true, rostersReady[1]]); else setRostersReady([false, rostersReady[1]]) }} ready={rostersReady[0]} />
            <Roster team={game.data.awayTeam} tournament={game.data.tournament} homeAway="AWAY" rosterReady={(isReady) => { if (isReady) setRostersReady([rostersReady[0], true]); else setRostersReady([rostersReady[0], false]) }} ready={rostersReady[1]} />
            <button onClick={async () => {
                if (rostersReady[0] == true && rostersReady[1] == true) {
                    await fetch(`${HOST}/game/${id}/start`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                    navigate(`/score/${id}`);
                }
                else {
                    alert('Rosters are not ready');
                }
            }} className={`${game.data.status === "scheduled" ? "" : "hidden"} rounded font-semibold bg-blue-500 hover:bg-blue-400 text-white drop-shadow-lg h-fit p-2`} >{game.data.status == "scheduled" ? "Start" : ""}</button>        </div>
    }</>)
}