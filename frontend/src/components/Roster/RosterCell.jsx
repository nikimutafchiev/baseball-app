import { useState, useEffect } from "react";
import RosterPositionPicker from "./RosterPositionPicker";
import RosterPlayerPicker from "./RosterPlayerPicker";
import { IoClose } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function RosterCell(props) {
    const { id } = useParams();
    const [clicked, setClicked] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [position, setPosition] = useState("");
    const [hovered, setHovered] = useState(false);
    const [player, setPlayer] = useState({
        id: -1,
        uniformNumber: "",
        firstName: "",
        lastName: "",
        position: "--"
    })
    useEffect(() => {
        setPlayer({
            id: props.player.id,
            uniformNumber: props.player.uniformNumber,
            position: props.player.position,
            firstName: props.player.player ? props.player.player.firstName : "",
            lastName: props.player.player ? props.player.player.lastName : "",

        });
        setPosition(props.player.position);
    }, [props.player]);
    const nextPage = () => setClicked((clicked + 1) % 3);
    const clearPlayer = () => {
        props.setPlayer(player.id, -1);
        setPlayer({
            id: -1,
            uniformNumber: "",
            firstName: "",
            lastName: "",
            position: "--"
        })
    };
    const { token, logout } = useAuth();
    useEffect(() => {
        if (submitted && clicked == 0 && player.id !== -1) {
            fetch(`${HOST}/game/team/roster/player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    home_away: props.homeAway,
                    game_id: id,
                    team_id: props.team.id,
                    tournament_id: props.tournament.id,
                    player_id: player.id,
                    position: position,
                    battingOrder: props.order

                }),
            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));
            setSubmitted(false);
        }
    }, [submitted, player, clicked]);
    return (<>
        <div className="flex flex-row flex-1 px-2 justify-between items-center" onClick={nextPage} onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="flex flex-row text-sm">
                <div className="font-bold w-12">{`#${player.uniformNumber}`}</div>
                <div>{player.firstName} {player.lastName}</div>
            </div>
            <div className="flex flex-row w-[30%] gap-3 items-center">
                <button className={`${hovered && player.firstName !== "" ? "" : "invisible"} rounded bg-accent_2 w-1/4 p-0.5 content-center text-white text-sm font-semibold place-items-center`} onClick={(e) => { e.stopPropagation(); clearPlayer() }}>
                    <IoClose size={20} />
                </button>
                <div className="font-semibold bg-primary_3 p-0.5 w-2/5 min-h-6 text-center text-sm rounded" onClick={(e) => { e.stopPropagation(); setClicked(2) }}>
                    {position}
                </div>
            </div>
        </div>
        {clicked === 1 && <RosterPlayerPicker team={props.team} tournament={props.tournament} clear={() => clearPlayer()} close={() => setClicked(0)} setter={(newValue) => { props.setPlayer(player.id, newValue.id); setPlayer(newValue); setSubmitted(true) }} nextPage={position === "--" ? nextPage : () => setClicked(0)} takenPlayers={props.takenPlayers} />}
        {clicked === 2 && <RosterPositionPicker close={() => setClicked(0)} setter={(newValue) => { props.setPosition(position, newValue); setPosition(newValue); setSubmitted(true) }} nextPage={nextPage} takenPositions={props.takenPositions} />}
    </>
    );
}