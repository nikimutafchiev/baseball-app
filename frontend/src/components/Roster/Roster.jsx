import { useParams } from "react-router-dom";
import RosterCell from "./RosterCell";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { HOST } from "../../host";
export default function Roster(props) {
    const { id } = useParams();
    const roster = useSWR(`${HOST}/game/team/roster/?home_away=${props.homeAway}&game_id=${id}`, (url) => fetch(url).then((res) => res.json()));
    const [takenPositions, setTakenPositions] = useState([]);
    const [takenPlayers, setTakenPlayers] = useState([]);
    const [pitcher, setPitcher] = useState({
        id: -1,
        uniformNumber: "",
        firstName: "",
        lastName: "",
        position: "--"
    });

    const [players, setPlayers] = useState([]);
    const getMissingOrders = (roster) => {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => !roster.map((player) => player.battingOrder).includes(number));
    }
    useEffect(() => {
        if (roster.data) {
            var newData = [...roster.data];
            //needed because players with order 1,2,4 are put 1,2,3 instead
            var missingOrders = getMissingOrders(roster.data);
            if (missingOrders.length == 0 && !props.ready)
                props.rosterReady(true);
            if (missingOrders.length != 0 && props.ready)
                props.rosterReady(false);
            while (newData.length < 9)
                newData.push({
                    id: -1,
                    uniformNumber: "",
                    firstName: "",
                    lastName: "",
                    position: "--",
                    battingOrder: missingOrders.pop()
                });
            setPlayers(newData);

        }
        else
            setPlayers(new Array(9).fill({
                id: -1,
                uniformNumber: "",
                firstName: "",
                lastName: "",
                position: "--"
            }))
        setTakenPlayers(roster.data ? roster.data.map((player) => player.player.id) : []);
        setTakenPositions(roster.data ? roster.data.map((player) => player.position) : []);
        // const newPitcher = roster.data ? roster.data.filter((player) => player.position == "P") : [];
        // if (newPitcher.length == 0)
        //     setPitcher({
        //         id: -1,
        //         uniformNumber: "",
        //         firstName: "",
        //         lastName: "",
        //         position: "--"
        //     });
        // else
        //     setPitcher(newPitcher[0]);
    }, [roster.data]);
    return (
        < div className="w-[36%] bg-white flex flex-col gap-2 rounded-xl shadow-xl p-6" >
            <div className="text-center font-semibold text-xl">
                {props.team.tlc}
            </div>
            {
                [...players].sort((a, b) => a.battingOrder - b.battingOrder).map((player, index) => <div className="flex flex-row items-center bg-primary_2 hover:bg-primary_2_hover cursor-pointer overflow-hidden text-white rounded-lg  shadow-md">
                    <div className="w-1/12 text-center font-semibold bg-primary_1 p-1">
                        {index + 1}
                    </div>
                    <RosterCell team={props.team} tournament={props.tournament} player={player} order={index + 1} homeAway={props.homeAway}
                        setPosition={(oldValue, newValue) => {
                            let updatedTakenPositions = takenPositions;
                            //асинхронен проблем с useState
                            if (oldValue !== "--") {
                                updatedTakenPositions = takenPositions.filter((value) => value != oldValue);
                                setTakenPositions(updatedTakenPositions);
                            }
                            if (newValue !== "--")
                                setTakenPositions([...updatedTakenPositions, newValue]);
                        }}
                        setPlayer={(oldValue, newValue) => {
                            let updatedTakenPlayers = takenPlayers;
                            //асинхронен проблем с useState
                            if (oldValue !== -1) {
                                updatedTakenPlayers = takenPlayers.filter((value) => value != oldValue);
                                setTakenPlayers(updatedTakenPlayers);
                            }
                            if (newValue !== -1)
                                setTakenPlayers([...updatedTakenPlayers, newValue]);
                        }
                        } takenPositions={takenPositions} takenPlayers={takenPlayers} />

                </div>
                )}

            {/* <div className="flex flex-row mt-4 items-center bg-primary_2 hover:bg-primary_2_hover cursor-pointer overflow-hidden text-white rounded-lg  shadow-md">
                <div className="w-1/12 text-center font-semibold bg-primary_1 p-1">
                    P
                </div>
                <RosterPitcherCell player={pitcher}
                    setPlayer={(oldValue, newValue) => {
                        let updatedTakenPlayers = takenPlayers;
                        //асинхронен проблем с useState
                        if (oldValue !== -1) {
                            updatedTakenPlayers = takenPlayers.filter((value) => value != oldValue);
                            setTakenPlayers(updatedTakenPlayers);
                        }
                        if (newValue !== -1)
                            setTakenPlayers([...updatedTakenPlayers, newValue]);
                    }
                    }
                    takenPlayers={takenPlayers}
                />
            </div> */}

        </div >
    )
}