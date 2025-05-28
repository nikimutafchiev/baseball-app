import { RiLiveLine } from "react-icons/ri"
import { TextField, ToggleButton, ToggleButtonGroup, MenuItem } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useSWR from "swr";
import { useParams, Link } from "react-router-dom";
import { RiArrowRightCircleLine, RiCalendarScheduleLine, RiCheckDoubleLine } from "react-icons/ri";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import validator from "validator"
import GameScorerPlayByPlay from "../GameScorer/GameScorerPlayByPlay";
import { CircularProgress, Alert } from "@mui/material";
import { HOST } from "../../host";
export default function GameInfo() {
    const { user, token } = useAuth();
    const statusIcons = {
        live: <RiLiveLine size={25} />,
        scheduled: <RiCalendarScheduleLine size={25} />,
        ended: <RiCheckDoubleLine size={25} />
    };
    const { id } = useParams();
    const game = useSWR(`${HOST}/game/${id}`, (url) => fetch(url).then((res) => res.json()));
    const [homeAway, setHomeAway] = useState("Home");
    const homeRoster = useSWR(`${HOST}/game/team/roster/?game_id=${id}&home_away=HOME`, (url) => fetch(url).then((res) => res.json()));
    const awayRoster = useSWR(`${HOST}/game/team/roster/?game_id=${id}&home_away=AWAY`, (url) => fetch(url).then((res) => res.json()));
    const situations = useSWR(`${HOST}/game/${id}/situations`, (url) => fetch(url).then((res) => res.json()));
    const [roster, setRoster] = useState([]);
    useEffect(() => {
        if (homeAway == "Home" && homeRoster.data)
            setRoster(homeRoster.data);
        if (homeAway == "Away" && awayRoster.data)
            setRoster(awayRoster.data);

    }, [homeAway, homeRoster, awayRoster]);
    const [assignee, setAssignee] = useState(user.username);
    const [menuOption, setMenuOption] = useState("Stats");
    return (<>
        <div className="flex flex-col md:flex-row gap-4">

            <div className="flex flex-col bg-white rounded-2xl drop-shadow-lg min-h-[82vh] max-h-[85vh] md:w-1/3 p-10 items-center justify-between">
                {game.data && <>
                    {user && user.role == "admin" && <div className="flex flex-row  justify-center gap-4 mb-2">
                        <TextField label={<div className="text-sm">Username</div>} variant="outlined" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-1/2" size="small" helperText={!validator.isURL(assignee) && assignee.length != 0 ? "Invalid username" : ""}></TextField>
                        <button className="p-2 py-3 h-fit text-white bg-blue-500 hover:bg-blue-600 text-xs rounded drop-shadow-md font-semibold"
                            onClick={() => {
                                fetch(`${HOST}/game/assign/?username=${assignee}&game_id=${game.data.id}&assigner_id=${user.id}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`
                                    },

                                }).then(response => response.json()).then(data => alert(data.message));
                            }}>
                            Assign for scoring
                        </button>
                    </div>}
                    <div className="flex flex-col text-gray-500 text-xs font-semibold ">
                        <div className="text-center">
                            {game.data.venue}
                        </div>
                        <div className="text-center">
                            {new Date(game.data.startTime).toLocaleString()}
                        </div>
                    </div>
                    <div className="grid grid-cols-3  w-full">
                        <div className="flex flex-col items-center text-center gap-2 text-xs font-semibold">
                            <img className="size-[80px]" src={game.data.homeTeam.image ? game.data.homeTeam.image : "https://placehold.co/80x80"}></img>
                            {game.data.homeTeam.name}
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-center text-2xl font-semibold">
                            <h3>
                                {game.data.homeResult}
                            </h3>
                            -
                            <h3>
                                {game.data.awayResult}
                            </h3>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-xs font-semibold text-center">
                            <img className="size-[80px]" src={game.data.awayTeam.image ? game.data.awayTeam.image : "https://placehold.co/80x80"}></img>
                            {game.data.awayTeam.name}
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-accent_2 gap-4">

                        <div className="flex flex-row gap-1 items-center">{statusIcons[game.data.status]}<div className=" uppercase">{game.data.status}</div></div>
                    </div>

                    <div className=" px-2 py-1 rounded flex flex-row items-center gap-4 justify-center w-full">
                        {game.data.status === "live" &&
                            <div className="relative  flex-1">

                                <div className="flex flex-row items-center gap-3">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="text-black flex flex-row font-semibold items-center ">{game.data.inning} {game.data.inningHalf == "UP" ? <FaCaretUp /> : <FaCaretDown />}</div>
                                        <div className="flex flex-row justify-center text-yellow-400">
                                            <GoDotFill size={10} className={`${game.data.outs > 0 ? "visible" : "invisible"}`} />
                                            <GoDotFill size={10} className={`${game.data.outs > 1 ? "visible" : "invisible"}`} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row  items-center">
                                        <div className={`${game.data.runners.thirdBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} size-3 rotate-45 items-center justify-center`}>
                                        </div>
                                        <div className={`${game.data.runners.secondBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} mb-6 size-3 rotate-45 items-center justify-center`}>
                                        </div>
                                        <div className={`${game.data.runners.firstBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} size-3 rotate-45 items-center justify-center`}>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        }
                        <table className="table-auto">
                            <thead className="border-b-[1px] text-xs border-gray-500 ">
                                <tr>
                                    {["Team", 1, 2, 3, 4, 5, 6, 7, 8, 9, "R", "H", "E", "LOB"].map((value) => <th className="p-1 font-bold">{value}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {[game.data.awayTeam.tlc, ...game.data.pointsByInning.away, game.data.awayResult, game.data.awayTeam.hits, game.data.awayTeam.errors, game.data.awayTeam.lob].map((value) => <td className="text-center font-semibold text-2xs p-1">{value}</td>)}
                                </tr>
                                <tr>
                                    {[game.data.homeTeam.tlc, ...game.data.pointsByInning.home, game.data.homeResult, game.data.homeTeam.hits, game.data.homeTeam.errors, game.data.homeTeam.lob].map((value) => <td className="text-center font-semibold text-2xs p-1">{value}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="w-full flex flex-row text-xs font-semibold">
                    <div className="w-1/2 text-center">
                        W - Petyo Petkov
                    </div>
                    <div className="w-1/2 text-center">
                        L - Evgenii Chernozemsky
                    </div>
                </div> */}
                    {game.data.venueLink && <div className="text-xs font-semibold">
                        Field location - <a className="text-blue-500 underline" href={game.data.venueLink} target="_blank">{game.data.venueLink}</a>
                    </div>}
                    <Link to={`/score/${game.data.id}`} className={`w-2/5 px-1 py-2 bg-orange-400 font-semibold  text-sm rounded text-white text-nowrap hover:bg-orange-300 flex flex-row items-center gap-1 justify-center drop-shadow-lg ${user && user.role == "admin" ? "" : "hidden"}`}><div>Score game</div><RiArrowRightCircleLine size={15} /></Link>
                </>}
                {game.isLoading && <div className="h-full w-full content-center text-center"><CircularProgress color='success' size={40} /></div>}
                {game.error && !game.isLoading && <Alert className="mt-10 flex flex-row justify-center w-full mx-auto" severity="error">Error occured, while fetching game info!</Alert>}
            </div>
            <div className="flex flex-col p-2 w-[65%] bg-white rounded-2xl drop-shadow-lg h-[85vh]">
                <div className="flex flex-row gap-6">
                    <TextField
                        size="small" className="w-1/6"
                        select
                        onChange={(e) => { setMenuOption(e.target.value) }}
                        value={menuOption}
                    >
                        {["Stats", "Play by play"].map((option) => (
                            <MenuItem key={option} value={option}>
                                {<div className="text-sm">{option}</div>}
                            </MenuItem>
                        ))}
                    </TextField>
                    {menuOption === "Stats" &&
                        <div className="w-1/2">
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                className="w-full"
                                value={homeAway}
                                onChange={(e, newValue) => {
                                    if (newValue) {
                                        setHomeAway(newValue);
                                    }
                                }}
                            >
                                <ToggleButton className="w-1/2" value="Home" ><div>Home</div></ToggleButton>
                                <ToggleButton className="w-1/2" value="Away" >Away</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    }
                </div>
                {menuOption === "Stats" &&
                    homeRoster.data && awayRoster.data &&
                    <div className="h-[90%]">
                        <TableContainer style={{ maxWidth: "98%", maxHeight: "100%", overflowY: "auto", overflowX: "auto" }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell sx={{ minWidth: 220 }}><div className="font-semibold">Player name</div></TableCell>
                                        <TableCell><div className="font-semibold">Position</div></TableCell>
                                        <TableCell><div className="font-semibold">AB</div></TableCell>
                                        <TableCell><div className="font-semibold">R</div></TableCell>
                                        <TableCell><div className="font-semibold">H</div></TableCell>
                                        <TableCell><div className="font-semibold">RBI</div></TableCell>
                                        <TableCell><div className="font-semibold">BB</div></TableCell>
                                        <TableCell><div className="font-semibold">SO</div></TableCell>
                                        <TableCell><div className="font-semibold">AVG</div></TableCell>
                                        <TableCell><div className="font-semibold">SLG</div></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{

                                    roster.map((row) => (
                                        <TableRow

                                            key={row.battingOrder}

                                        >

                                            <TableCell component="th" scope="row">
                                                {row.battingOrder}
                                            </TableCell>
                                            <TableCell ><div className={row.battingOrder == 8 ? "ml-8" : ""}>{row.player.firstName} {row.player.lastName}</div></TableCell>
                                            <TableCell><div>{row.position}</div></TableCell>
                                            <TableCell>{row.stats ? row.stats.AB : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.R : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.H : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.RBI : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.BB : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.SO : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.AVG.toFixed(3) : 0}</TableCell>
                                            <TableCell>{row.stats ? row.stats.SLG.toFixed(3) : 0}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
                {menuOption === "Stats" && homeRoster.isLoading && awayRoster.isLoading && <div className="h-full content-center text-center w-full"><CircularProgress color='success' size={40} /></div>}
                {menuOption === "Stats" && homeRoster.error && awayRoster.error && !homeRoster.isLoading && !awayRoster.isLoading && <Alert className="mt-10 flex flex-row justify-center w-1/2 mx-auto" severity="error">Error occured, while fetching situations!</Alert>}

                {menuOption === "Play by play" && situations.data && <div className="max-h-[75vh]"><GameScorerPlayByPlay situations={[...situations.data].sort((a, b) => b.id - a.id)} /></div>
                }
                {menuOption === "Play by play" && situations.error && !situations.isLoading && <Alert className="mt-10 flex flex-row justify-center w-1/2 mx-auto" severity="error">Error occured, while fetching situations!</Alert>}

                {menuOption === "Play by play" && situations.isLoading && <div className="h-full w-full content-center text-center"><CircularProgress color='success' size={40} /></div>}
            </div>
        </div >
    </>)
}