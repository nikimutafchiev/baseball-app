import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import useSWR from "swr";
import { HOST } from "../../host";
export default function TournamentInfoPlayerLeaderboard() {
    const { id } = useParams();
    const stats = useSWR(`${HOST}/tournament/${id}/stats`, (url) => fetch(url).then((res) => res.json()));
    const [overviewOption, setOverviewOption] = useState("Batting");
    return (<>
        {
            stats.data && <div className="w-full flex flex-col gap-4">
                <div className="bg-white rounded self-center drop-shadow-lg">
                    <ToggleButtonGroup exclusive
                        value={overviewOption}
                        onChange={(e, newValue) => {
                            if (newValue) {
                                setOverviewOption(newValue);
                            }
                        }}>
                        <ToggleButton value="Batting">Batting</ToggleButton>
                        {/* <ToggleButton value="Pitching">Pitching</ToggleButton> */}
                        <ToggleButton value="Fielding">Fielding</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className="w-full grid  grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-10">
                    {(overviewOption == "Batting" ? [
                        { "label": "AVG", "coefficient": true },
                        { "label": "OBP", "coefficient": true },
                        { "label": "H", "coefficient": false },
                        { "label": "BB", "coefficient": false },
                        { "label": "SO", "coefficient": false },
                        { "label": "1B", "coefficient": false },
                        { "label": "2B", "coefficient": false },
                        { "label": "3B", "coefficient": false },
                        { "label": "HR", "coefficient": false },
                        { "label": "IBB", "coefficient": false },
                        { "label": "SLG", "coefficient": true },
                        { "label": "HBP", "coefficient": false },
                        { "label": "XBH", "coefficient": false },
                        { "label": "SB", "coefficient": false },
                        { "label": "CS", "coefficient": false }
                    ] :
                        [{ "label": "PO", "coefficient": false },
                        { "label": "A", "coefficient": false },
                        { "label": "E", "coefficient": false },
                        { "label": "FIP", "coefficient": true },]).sort((a, b) => a.coefficient == b.coefficient ? a.label.localeCompare(b.label) : b.coefficient - a.coefficient).map((stat) => (
                            <div className="w-full flex flex-col">
                                <div className="flex flex-col w-fit  mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 pr-4">{stat.label}</h3>
                                    <hr className="border-t-2 border-gray-400 rounded">
                                    </hr>
                                </div>
                                <div className="w-full flex flex-col bg-white rounded-lg shadow-md max-h-[400px] overflow-y-auto overflow-hidden">
                                    {/* <div className="flex flex-col bg-primary_2  hover:bg-primary_2_hover p-4 cursor-pointer ">
                                <h4 className="text-xl font-semibold text-white mb-2">
                                    #1 - Evgenii Chernozemsky
                                </h4>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://placehold.co/40x40"
                                        alt="Top Player"
                                        className="size-10 rounded-full border border-gray-300"
                                    />
                                    <div className="text-sm text-white">Blues Sofia</div>
                                </div>
                                <div className="text-2xl font-bold text-white text-right mt-2">
                                    0.999
                                </div>
                            </div> */}
                                    {/* {[
                                {
                                    leaderboardPlace: 2,
                                    name: "Petar Petrov",
                                    teamName: "CSKA Sofia",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.689,
                                },
                                {
                                    leaderboardPlace: 3,
                                    name: "Georgi Georgiev",
                                    teamName: "Levski Sofia",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.675,
                                },
                                {
                                    leaderboardPlace: 4,
                                    name: "Dimitar Dimitrov",
                                    teamName: "Ludogorets Razgrad",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.662,
                                },
                                {
                                    leaderboardPlace: 5,
                                    name: "Todor Todorov",
                                    teamName: "Cherno More",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.650,
                                },
                                {
                                    leaderboardPlace: 6,
                                    name: "Nikolay Nikolov",
                                    teamName: "Botev Plovdiv",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.639,
                                },
                                {
                                    leaderboardPlace: 7,
                                    name: "Kiril Kirilov",
                                    teamName: "Lokomotiv Plovdiv",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.625,
                                },
                                {
                                    leaderboardPlace: 8,
                                    name: "Vasil Vasilev",
                                    teamName: "Slavia Sofia",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.612,
                                },
                                {
                                    leaderboardPlace: 9,
                                    name: "Stanislav Stanev",
                                    teamName: "Septemvri Sofia",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.600,
                                },
                                {
                                    leaderboardPlace: 10,
                                    name: "Atanas Atanasov",
                                    teamName: "Beroe Stara Zagora",
                                    teamLogo: "https://placehold.co/20x20",
                                    statValue: 0.585,
                                },
                            ]*/
                                        [...stats.data].sort((a, b) => b.stats[stat.label] - a.stats[stat.label]).map((player, index) => (
                                            <>
                                                {index == 0 && <Link to={`/players/${player.id}`} className="flex flex-col sticky top-0 shadow-lg bg-primary_2  gap-1 hover:bg-primary_2_hover p-3 cursor-pointer ">
                                                    <h4 className="text-xl font-semibold text-white mb-2">
                                                        #1 {player.firstName} {player.lastName}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src="https://placehold.co/40x40"
                                                            alt="Top Player"
                                                            className="size-10 rounded-full border border-gray-300"
                                                        />
                                                        <div className="text-sm text-white">{player.teamName}</div>
                                                    </div>
                                                    <div className="text-3xl font-bold text-white text-right">
                                                        {stat.coefficient == true ? player.stats[stat.label].toFixed(3) : player.stats[stat.label]}
                                                    </div>
                                                </Link>}
                                                {index != 0 && <Link to={`/players/${player.id}`} className="flex flex-row items-center justify-between hover:bg-gray-50 px-4 py-3 transition duration-200 cursor-pointer">
                                                    <div className="flex items-center gap-3 ">
                                                        <div className="text-gray-500 font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        <img
                                                            src={player.teamImage ? player.teamImage : "http://placehold.co/20x20"}
                                                            className="size-5 rounded-full"
                                                        />
                                                        <div className="flex flex-col text-sm">
                                                            <div className="font-medium text-gray-800">{player.firstName} {player.lastName}</div>
                                                            <div className="text-xs text-gray-500">{player.teamName}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-800">
                                                        {stat.coefficient == true ? player.stats[stat.label].toFixed(3) : player.stats[stat.label]}
                                                    </div>
                                                </Link>}


                                            </>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>


            </div >
        }</>)
}