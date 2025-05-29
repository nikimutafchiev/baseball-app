import { TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function PlayerRosterSelect(props) {
    const [uniformNumber, setUniformNumber] = useState("");
    const { team_id, id } = useParams();
    const { token, logout } = useAuth();
    const add_player = async () => {
        await fetch(`${HOST}/tournament/team_tournament/player/?tournament_id=${id}&team_id=${team_id}&player_id=${props.player.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                uniformNumber: uniformNumber
            })
        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
        props.close();
    }
    return (<>
        <button className={`bg-gray-200 hover:bg-gray-300 flex flex-row  justify-between py-2 px-4 my-2 rounded items-center gap-6 `}
            onClick={() => {
                if (uniformNumber != "") {
                    add_player()
                }
            }}>

            <div className="flex flex-row items-center gap-6">
                <img className="size-[100px]" src={props.player.image ? props.player.image : "https://placehold.co/100x100"} />
                <TextField
                    className="w-[120px]"
                    size="small"
                    type="number"
                    label={<div className="text-sm ">Uniform number</div>}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment >{<div className="text-sm mr-1">#</div>}</InputAdornment>,
                            inputProps: {
                                maxLength: 2
                            }
                        },
                    }}
                    onChange={(e) => {
                        if (e.target.value <= 100 && e.target.value >= 0)
                            setUniformNumber(e.target.value)
                    }}
                    value={uniformNumber}

                />
                <div className="text-2xl font-semibold">{props.player.firstName} {props.player.lastName}</div>
            </div>
            <div className="text-lg gap-4 flex flex-row items-center">
                <div>
                    {new Date(props.player.dateOfBirth).toLocaleDateString()}
                </div>
                <div>
                    {props.player.country}
                </div>
            </div>
        </button></>)
}