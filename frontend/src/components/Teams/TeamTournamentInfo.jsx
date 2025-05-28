import { FaFacebook, FaInstagram, FaLink, FaYoutube } from "react-icons/fa"
import { Autocomplete, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    MenuItem, CircularProgress
} from "@mui/material";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5"
import { Link, useParams } from "react-router-dom"
import useSWR from "swr"
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiSaveLine, RiTeamLine } from "react-icons/ri";
import { LineChart } from "@mui/x-charts";
import { HOST } from "../../host";
export default function TeamTournamentInfo(props) {
    const { team_id, id } = useParams();
    const icons = {
        facebook: <FaFacebook size={20} />,
        instagram: <FaInstagram size={20} />,
        website: <FaLink size={20} />,
        youtube: <FaYoutube size={20} />
    }
    const [teamIDs, setTeamIDs] = useState([]);
    const query_params = {
        tournament_query: `tournament_ids=[${id}]`,
        team_query: teamIDs.length != 0 ? `team_ids=[${teamIDs}]` : "",

    };
    const get_query = (team = null, h2h = null) => {
        var res = "";
        res += `?${query_params.tournament_query}`;
        if (team == true && query_params.team_query.length != 0)
            res += `${res.length == 0 ? "?" : "&"}${query_params.team_query}`;
        if (h2h) res += `${res.length == 0 ? "?" : "&"}team_ids=[${h2h}]`;
        return res;
    };
    const [isEdit, setIsEdit] = useState(false);
    const team = useSWR(`${HOST}/team/${team_id}`, (url) => fetch(url).then((res) => res.json()));
    const [isShrinked, setIsShrinked] = useState(false);
    const teams = useSWR(
        `${HOST}/team/${team_id}/teams/${get_query()}`,
        (url) => fetch(url).then((res) => res.json())
    );
    const [tableOption, setTableOption] = useState("Games");

    const stats = useSWR(
        `${HOST}/team/${team_id}/stats/${get_query(true)}`,
        (url) => fetch(url).then((res) => res.json())
    );
    const [sortColumn, setSortColumn] = useState("startTime");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [graphStat, setGraphStat] = useState("AVG");
    const get_stat_array = (stat, games) => {
        if (["H", "BB", "SO"].includes(stat))
            return games.map((game) => game.stats[stat]);
        var res = [];
        let temp_stats = {
            PA: 0,
            H: 0,
            AB: 0,
            SO: 0,
            BB: 0,
            HBP: 0,
            AVG: 0,
            SLG: 0,
            "1B": 0,
            "2B": 0,
            "3B": 0,
            HR: 0,
        };
        for (let i = 0; i < games.length; i++) {
            temp_stats["H"] += games[i].stats["H"];
            temp_stats["1B"] += games[i].stats["1B"];
            temp_stats["2B"] += games[i].stats["2B"];
            temp_stats["3B"] += games[i].stats["3B"];
            temp_stats["HR"] += games[i].stats["HR"];
            temp_stats["AB"] += games[i].stats["AB"];
            temp_stats["PA"] += games[i].stats["PA"];
            temp_stats["BB"] += games[i].stats["BB"];
            temp_stats["HBP"] += games[i].stats["HBP"];
            if (stat == "AVG")
                res.push(
                    temp_stats["AB"] ? (temp_stats["H"] / temp_stats["AB"]).toFixed(3) : 0
                );
            else if (stat == "SLG")
                res.push(
                    temp_stats["AB"]
                        ? (
                            (temp_stats["1B"] +
                                2 * temp_stats["2B"] +
                                3 * temp_stats["3B"] +
                                4 * temp_stats["HR"]) /
                            temp_stats["AB"]
                        ).toFixed(3)
                        : 0
                );
            else if (stat == "OBP") {
                res.push(
                    temp_stats["PA"]
                        ? (
                            (temp_stats["H"] +
                                temp_stats["BB"] +
                                temp_stats["HBP"]
                            ) /
                            temp_stats["PA"]
                        ).toFixed(3)
                        : 0
                )
            }

        }
        return res;
    };
    return (<>{
        team.data && <div className="w-full h-full flex flex-row gap-4">
            {!isShrinked &&
                <div className="w-1/5 h-fit ">
                    <div className="items-center flex flex-col gap-3 bg-white drop-shadow-lg p-2">
                        <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                            <IoReorderThree size={20} />
                        </button>
                        <div className="w-full flex flex-col items-center gap-4">
                            <img className="size-[150px]" src={team.data.image ? team.data.image : "https://placehold.co/150x150"}></img>
                            <h3 className="text-xl font-semibold">{team.data.name}</h3>
                        </div>
                        <hr className="border-t-2 w-full"></hr>
                        <div className="w-full flex flex-col text-gray-500 items-center gap-2 text-xs">
                            <div>Address: {team.data.address}</div>
                            <div>Contact: {team.data.contact}</div>
                        </div>
                        <hr className="border-t-2 w-full"></hr>
                        <div className="w-full flex flex-col text-gray-500 items-center gap-2 text-xs">
                            <div>Manager: {team.data.manager}</div>
                            <div>Head Coach: {team.data.headCoach}</div>
                        </div>
                        <div className="w-10/12 flex flex-row justify-around mt-2">
                            {Object.entries(team.data.socialMedia).map(([media, page]) => <a href={page} target="_blank">{icons[media]}</a>)}
                        </div>
                        <Link to={"roster"} className="flex flex-row  items-center border-black border-[1px] rounded w-full gap-4 p-1 px-2 text-xl font-semibold shadow-md hover:bg-gray-100">
                            <RiTeamLine />Roster
                        </Link>
                        <button className={`flex items-center gap-2 px-4 py-2 text-sm bg-white font-medium rounded border-2 transition ${isEdit
                            ? "border-green-500 text-green-600 hover:bg-green-50"
                            : "border-gray-500 text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => setIsEdit(!isEdit)}>
                            {isEdit ? (
                                <>
                                    <RiSaveLine size={20} />
                                    Save
                                </>
                            ) : (
                                <>
                                    <BiEdit size={20} />
                                    Edit
                                </>
                            )}
                        </button>

                    </div>
                </div>}
            {isShrinked && <div className="relative size-11 ">
                <div className="fixed size-11 bg-white drop-shadow-lg p-2">
                    <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                        <IoReorderThree size={20} />
                    </button>
                </div>
            </div>}
            <div className="flex flex-1 flex-row gap-8">
                <div className="bg-line w-[2px]"></div>
                <div className="flex flex-1 flex-col gap-4 h-fit">
                    <div className="flex flex-row justify-around h-12">
                        <div className=" md:w-1/3 rounded  drop-shadow-lg">
                            <Autocomplete
                                multiple
                                limitTags={1}
                                className="absolute inset-0"
                                size="small"
                                options={teams.data ? teams.data : []}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.name}
                                onChange={(e, newValues) =>
                                    setTeamIDs(newValues.map((value) => value.id))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        label="Opponent teams"
                                        className="bg-white rounded h-fit"
                                        {...params}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <h3 className="text-3xl font-semibold">Stats overview</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            {
                                label: "G",
                                value: `${stats.data ? stats.data.stats.W + stats.data.stats.L : 0
                                    }`
                            },
                            {
                                label: "W-L",
                                value: `${stats.data ? stats.data.stats.W : 0}-${stats.data ? stats.data.stats.L : 0
                                    }`,
                            },

                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 h-28 rounded-2xl shadow-lg flex flex-col justify-between"
                            >
                                <div className="flex flex-row text-lg justify-between items-center">
                                    <div className="font-bold text-gray-800">
                                        {stat.label}
                                    </div>
                                </div>
                                <div className="text-5xl font-semibold text-gray-700">
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isShrinked ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3`}>
                        {[
                            {
                                label: "AVG",
                                value: stats.data ? (
                                    stats.data.stats.AVG.toFixed(3)
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0.0
                                ),
                                coefficient: true
                            },
                            {
                                label: "AB",
                                value: stats.data ? (
                                    stats.data.stats.AB
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "OBP",
                                value: stats.data ? (
                                    stats.data.stats.OBP.toFixed(3)
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0.0
                                ),
                                coefficient: true
                            },
                            {
                                label: "SO",
                                value: stats.data ? (
                                    stats.data.stats.SO
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "BB",
                                value: stats.data ? (
                                    stats.data.stats.BB
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "H",
                                value: stats.data ? (
                                    stats.data.stats.H
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "1B",
                                value: stats.data ? (
                                    stats.data.stats["1B"]
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "2B",
                                value: stats.data ? (
                                    stats.data.stats["2B"]
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "3B",
                                value: stats.data ? (
                                    stats.data.stats["3B"]
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "HR",
                                value: stats.data ? (
                                    stats.data.stats.HR
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "PA",
                                value: stats.data ? (
                                    stats.data.stats.PA
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false

                            },
                            {
                                label: "SLG",
                                value: stats.data ? (
                                    stats.data.stats.SLG.toFixed(3)
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0.0
                                ),
                                coefficient: true
                            },
                            {
                                label: "HBP",
                                value: stats.data ? (
                                    stats.data.stats.HBP
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "R",
                                value: stats.data ? (
                                    stats.data.stats.R
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "RBI",
                                value: stats.data ? (
                                    stats.data.stats.RBI
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "IBB",
                                value: stats.data ? (
                                    stats.data.stats.IBB
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "OPS",
                                value: stats.data ? (
                                    stats.data.stats.OPS.toFixed(3)
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: true
                            },
                            {
                                label: "TB",
                                value: stats.data ? (
                                    stats.data.stats.TB
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "XBH",
                                value: stats.data ? (
                                    stats.data.stats.XBH
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                            {
                                label: "ROE",
                                value: stats.data ? (
                                    stats.data.stats.ROE
                                ) : stats.isLoading ? (
                                    <div >
                                        <CircularProgress color="success" />
                                    </div>
                                ) : (
                                    0
                                ),
                                coefficient: false
                            },
                        ].sort((a, b) => a.coefficient == b.coefficient ? a.label.localeCompare(b.label) : b.coefficient - a.coefficient).map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 h-28 rounded-2xl shadow-lg flex flex-col justify-between"
                            >
                                <div className="flex flex-col w-fit justify-between items-center">
                                    <a className="font-semibold text-gray-800 pr-6" href="/guide">
                                        {stat.label}
                                    </a>
                                    <hr className="border-t-2 border-gray-200 w-full">
                                    </hr>
                                </div>
                                <div className="text-4xl font-semibold text-gray-700">
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="border-t-2 border-line"></hr>
                    <h3 className="text-3xl font-semibold">Detailed stats</h3>
                    <div className="flex flex-row justify-around h-12">

                        <div className=" w-1/3 rounded  drop-shadow-lg">
                            <Autocomplete
                                multiple
                                limitTags={1}
                                className="absolute inset-0"
                                size="small"
                                options={teams}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                    <TextField label="Team" className="bg-white rounded h-fit"{...params} />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-around">
                        <TextField
                            size="small" className="w-1/6 bg-white overflow-hidden rounded"
                            select
                            onChange={(e) => { setTableOption(e.target.value); if (e.target.value == "Games") { setSortColumn("startTime"); setSortOrder("DESC"); } else { setSortColumn("firstName"); setSortOrder("ASC"); } }}
                            value={tableOption}
                        >
                            {["Games", "Players"].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {<div className="text-sm">{option}</div>}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className="bg-white rounded drop-shadow-lg">

                            <ToggleButtonGroup color="primary" exclusive>
                                <ToggleButton>Batting</ToggleButton>
                                <ToggleButton>Pitching</ToggleButton>
                                <ToggleButton>Fielding</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    </div>

                    <div className="w-full drop-shadow-lg h-96">
                        {/* <div className="bg-white rounded">
                                <ToggleButtonGroup
                                    color="primary"
                                    exclusive
                                >
                                    <ToggleButton>Graph</ToggleButton>
                                    <ToggleButton>Table</ToggleButton>
                                </ToggleButtonGroup>
                            </div> */}

                        {stats.data && tableOption == "Games" &&
                            (
                                <TableContainer
                                    style={{
                                        maxWidth: "100%",
                                        minHeight: "100%",
                                        maxHeight: "100%",
                                        overflowY: "auto",
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {[{ title: "Start time", id: "startTime" }, {
                                                    title: "Home team",
                                                    id: "homeTeam"
                                                },
                                                {
                                                    title: "Away team",
                                                    id: "awayTeam"
                                                },
                                                {
                                                    title: "AB",
                                                    id: "AB"
                                                },
                                                {
                                                    title: "R",
                                                    id: "R"
                                                },
                                                {
                                                    title: "H",
                                                    id: "H"
                                                },
                                                {
                                                    title: "RBI",
                                                    id: "RBI"
                                                },
                                                {
                                                    title: "BB",
                                                    id: "BB"
                                                },
                                                {
                                                    title: "SO",
                                                    id: "SO"
                                                },
                                                {
                                                    title: "AVG",
                                                    id: "AVG"
                                                },
                                                {
                                                    title: "OBP",
                                                    id: "OBP"
                                                },
                                                {
                                                    title: "SLG",
                                                    id: "SLG"
                                                }].map((column) =>
                                                    <TableCell onClick={() => { if (sortColumn == column.id) setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC"); else { setSortColumn(column.id); setSortOrder("DESC") } }}>
                                                        <div className="flex flex-row items-center cursor-pointer min-w-fit gap-0.5">
                                                            <div className="text-sm font-semibold">
                                                                {column.title}
                                                            </div>
                                                            <div className={`${sortColumn == column.id ? "visible" : "invisible"}`}> {sortOrder == "ASC" && <FaArrowUp size={10} />}
                                                                {sortOrder == "DESC" && <FaArrowDown size={10} />}
                                                            </div></div></TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={{ overflowY: "auto" }}>
                                            {[...stats.data.games_stats].sort((a, b) => { const res = ["homeTeam", "awayTeam"].includes(sortColumn) ? b[sortColumn].localeCompare(a[sortColumn]) : sortColumn == 'startTime' ? new Date(b[sortColumn]) - new Date(a[sortColumn]) : b.stats[sortColumn] - a.stats[sortColumn]; if (sortOrder == "ASC") return -res; return res; }).map((row) => (
                                                <TableRow key={row.id}>
                                                    {/* <TableCell component="th" scope="row">
																{row.battingOrder}
															</TableCell> */}
                                                    <TableCell>
                                                        {new Date(row.startTime).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>{row.homeTeam}</TableCell>
                                                    <TableCell>{row.awayTeam}</TableCell>
                                                    <TableCell>{row.stats.AB}</TableCell>
                                                    <TableCell>{row.stats.R}</TableCell>
                                                    <TableCell>{row.stats.H}</TableCell>
                                                    <TableCell>{row.stats.RBI}</TableCell>
                                                    <TableCell>{row.stats.BB}</TableCell>
                                                    <TableCell>{row.stats.SO}</TableCell>
                                                    <TableCell>{row.stats.AVG.toFixed(3)}</TableCell>
                                                    <TableCell>{row.stats.OBP.toFixed(3)}</TableCell>
                                                    <TableCell>{row.stats.SLG.toFixed(3)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter
                                            sx={{
                                                position: "sticky",
                                                bottom: 0,
                                                zIndex: 1,
                                                backgroundColor: "white",
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.AB : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.R : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.H : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.RBI : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.BB : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.SO : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.AVG.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.OBP.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.SLG.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            )}
                        {stats.data && tableOption == "Players" &&
                            (
                                <TableContainer
                                    style={{
                                        maxWidth: "100%",
                                        minHeight: "100%",
                                        maxHeight: "100%",
                                        overflowY: "auto",
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {[{
                                                    title: "First name",
                                                    id: "firstName"
                                                },
                                                {
                                                    title: "Last name",
                                                    id: "lastName"
                                                },
                                                {
                                                    title: "AB",
                                                    id: "AB"
                                                },
                                                {
                                                    title: "R",
                                                    id: "R"
                                                },
                                                {
                                                    title: "H",
                                                    id: "H"
                                                },
                                                {
                                                    title: "RBI",
                                                    id: "RBI"
                                                },
                                                {
                                                    title: "BB",
                                                    id: "BB"
                                                },
                                                {
                                                    title: "SO",
                                                    id: "SO"
                                                },
                                                {
                                                    title: "AVG",
                                                    id: "AVG"
                                                },
                                                {
                                                    title: "OBP",
                                                    id: "OBP"
                                                },
                                                {
                                                    title: "SLG",
                                                    id: "SLG"
                                                },
                                                ].map((column) =>
                                                    <TableCell onClick={() => { if (sortColumn == column.id) setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC"); else { setSortColumn(column.id); setSortOrder("DESC") } }}>
                                                        <div className="flex flex-row items-center cursor-pointer min-w-fit gap-0.5">
                                                            <div className="text-sm font-semibold">
                                                                {column.title}
                                                            </div>
                                                            <div className={`${sortColumn == column.id ? "visible" : "invisible"}`}> {sortOrder == "ASC" && <FaArrowUp size={10} />}
                                                                {sortOrder == "DESC" && <FaArrowDown size={10} />}
                                                            </div></div></TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={{ overflowY: "auto" }}>
                                            {[...stats.data.players_stats].sort((a, b) => { const res = ["firstName", "lastName"].includes(sortColumn) ? b[sortColumn].localeCompare(a[sortColumn]) : b.stats[sortColumn] - a.stats[sortColumn]; if (sortOrder == "ASC") return -res; return res; }).map((row) => (
                                                <TableRow key={row.id}>
                                                    {/* <TableCell component="th" scope="row">
																{row.battingOrder}
															</TableCell> */}
                                                    <TableCell>{row.firstName}</TableCell>
                                                    <TableCell>{row.lastName}</TableCell>
                                                    <TableCell>{row.stats.AB}</TableCell>
                                                    <TableCell>{row.stats.R}</TableCell>
                                                    <TableCell>{row.stats.H}</TableCell>
                                                    <TableCell>{row.stats.RBI}</TableCell>
                                                    <TableCell>{row.stats.BB}</TableCell>
                                                    <TableCell>{row.stats.SO}</TableCell>
                                                    <TableCell>{row.stats.AVG.toFixed(3)}</TableCell>
                                                    <TableCell>{row.stats.OBP.toFixed(3)}</TableCell>
                                                    <TableCell>{row.stats.SLG.toFixed(3)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter
                                            sx={{
                                                position: "sticky",
                                                bottom: 0,
                                                zIndex: 1,
                                                backgroundColor: "white",
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.AB : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.R : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.H : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.RBI : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.BB : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.SO : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.AVG.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.OBP.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-semibold text-black text-sm">
                                                        {stats.data ? stats.data.stats.SLG.toFixed(3) : 0}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            )}
                    </div>
                    <div className="w-full  drop-shadow-lg min-h-96 bg-white rounded-2xl p-2">
                        <TextField
                            size="small"
                            className="w-1/6"
                            select
                            onChange={(e) => {
                                setGraphStat(e.target.value);
                            }}
                            value={graphStat}
                        >
                            {["AVG", "SLG", "OBP"].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {<div className="text-sm">{option}</div>}
                                </MenuItem>
                            ))}
                        </TextField>
                        {stats.data && (
                            <LineChart
                                xAxis={[
                                    {
                                        data: stats.data.games_stats.map(
                                            (game) => new Date(game.startTime)
                                        ),
                                        valueFormatter: (date) =>
                                            new Date(date).toLocaleDateString(),
                                    },
                                ]}
                                series={[
                                    {
                                        data: get_stat_array(
                                            graphStat,
                                            stats.data.games_stats.sort(
                                                (a, b) =>
                                                    new Date(a.startTime) - new Date(b.startTime)
                                            )
                                        ),
                                        label: graphStat,
                                        color: "#6A994E",
                                        area: true,
                                        id: "stat",
                                    },
                                ]}
                                grid={{ horizontal: true }}
                                height={400}
                                sx={{
                                    "--Charts-lineArea-opacity": 1,
                                    "& .MuiAreaElement-series-stat": {
                                        fill: "url('#gradient')",
                                    },
                                }}
                            >
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="0%"
                                            stopColor="#84b867"
                                            stopOpacity={0.5}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#84b867"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        )}
                    </div>



                </div>
            </div>

        </div >
    }
    </>
    )
}