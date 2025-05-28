import {
	Autocomplete,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	MenuItem,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiSaveLine } from "react-icons/ri";
import { IoReorderThree } from "react-icons/io5";
import { CircularProgress } from "@mui/material";
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
} from "@mui/material";
import InputFormPlayer from "../InputForms/InputFormPlayer";
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import useSWR from "swr";
import PlayerSelectList from "../Other/PlayerSelectList";
import { HOST } from "../../host";
export default function PlayerInfo() {
	const [isEdit, setIsEdit] = useState(false);
	const { id } = useParams();
	const [teamIDs, setTeamIDs] = useState([]);
	const [tournamentIDs, setTournamentIDs] = useState([]);
	const [yearsSelect, setYearsSelect] = useState([]);
	const [selectClicked, setSelectClicked] = useState(false);
	const [overviewOption, setOverviewOption] = useState("Batting");
	const query_params = {
		tournament_query:
			tournamentIDs.length != 0 ? `tournament_ids=[${tournamentIDs}]` : "",
		team_query: teamIDs.length != 0 ? `team_ids=[${teamIDs}]` : "",
		year_query: yearsSelect.length != 0 ? `years=[${yearsSelect}]` : "",
	};
	const get_query = (tournament, team, year) => {
		var res = "";
		if (tournament == true && query_params.tournament_query.length != 0)
			res += `?${query_params.tournament_query}`;
		if (team == true && query_params.team_query.length != 0)
			res += `${res.length == 0 ? "?" : "&"}${query_params.team_query}`;
		if (year == true && query_params.year_query.length != 0)
			res += `${res.length == 0 ? "?" : "&"}${query_params.year_query}`;
		return res;
	};
	const player = useSWR(`${HOST}/player/${id}`, (url) =>
		fetch(url).then((res) => res.json())
	);
	const players = useSWR(`${HOST}/players`, (url) =>
		fetch(url).then((res) => res.json())
	);
	const [selectedPlayer, setSelectedPlayer] = useState(null);
	const stats = useSWR(
		`${HOST}/player/${id}/stats/${get_query(true, true, true)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const [selectedPlayerStats, setSelectedPlayerStats] = useState([]);
	const games_stats = useSWR(
		`${HOST}/player/${id}/games_stats/${get_query(
			true,
			true,
			true
		)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const years = useSWR(
		`${HOST}/player/${id}/years/${get_query(true, true, false)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const teams = useSWR(
		`${HOST}/player/${id}/teams/${get_query(true, false, true)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const tournaments = useSWR(
		`${HOST}/player/${id}/tournaments/${get_query(
			false,
			true,
			true
		)}`,
		(url) => fetch(url).then((res) => res.json())
	);

	const [isShrinked, setIsShrinked] = useState(false);
	const [graphStat, setGraphStat] = useState("AVG");
	const [sortColumn, setSortColumn] = useState("startTime");
	const [sortOrder, setSortOrder] = useState("DESC");

	useEffect(() => {
		if (selectedPlayer)
			fetch(
				`${HOST}/player/${selectedPlayer.id}/stats/${get_query(
					true,
					true,
					true
				)}`
			)
				.then((response) => response.json())
				.then((data) => {
					setSelectedPlayerStats(data);
				})
				.catch((error) => console.error(error));
		else setSelectedPlayerStats(null);
	}, [selectedPlayer]);
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
	return (
		<div>
			{player.data && (
				<div className="flex flex-col md:flex-row w-full gap-8 text-white text-sm ">
					{!isShrinked && (
						<div className="relative md:w-1/5">
							<div className="flex flex-col h-fit bg-gradient-to-br p-4 gap-4 justify-between items-center min-h-[80vh] from-accent_3 via-accent_2 to-accent_1 rounded ">
								<button
									className=" left-1 top-1 absolute rounded-full p-1 bg-accent_1 hover:bg-accent_2 "
									onClick={() => setIsShrinked(!isShrinked)}
								>
									<IoReorderThree size={20} />
								</button>
								<h3 className="text-xl font-semibold">
									{player.data.firstName} {player.data.lastName}
								</h3>
								<img
									className="w-[180px] h-[200px]"
									src={
										player.data.image
											? player.data.image
											: "http://placehold.co/180x200"
									}
								/>
								<div className="flex flex-col gap-0.5 items-center w-full">
									{player.data.height && (
										<div className="font-semibold flex flex-row justify-between w-full bg-gray-400 px-2 py-1 rounded bg-opacity-50">
											<div>Height:</div>{" "}
											<div className="w-fit flex flex-row gap-1">
												<div>{player.data.height}</div>
												<div> cm</div>
											</div>
										</div>
									)}
									{player.data.weigth && (
										<div className="font-semibold flex flex-row justify-between w-full bg-gray-400 px-2 py-1 rounded bg-opacity-50">
											<div>Weigth:</div> <div>{player.data.weigth} kg</div>
										</div>
									)}
									{player.data.dateOfBirth && (
										<div className="font-semibold flex flex-row justify-between w-full bg-gray-400 px-2 py-1 rounded bg-opacity-50">
											<div>Birthday:</div>{" "}
											<div>
												{new Date(player.data.dateOfBirth).toLocaleDateString()}
											</div>
										</div>
									)}
									{player.data.country && (
										<div className="font-semibold flex flex-row justify-between w-full bg-gray-400 px-2 py-1 rounded bg-opacity-50 text-nowrap">
											<div>Birthplace:</div> <div>{player.data.country}</div>
										</div>
									)}
									{player.data.battingSide && player.data.throwingArm && (
										<div className="font-semibold flex flex-row justify-between w-full bg-gray-400 px-2 py-1 rounded bg-opacity-50">
											<div>Batting/Throwing:</div>
											<div>
												{player.data.battingSide}/{player.data.throwingArm}
											</div>{" "}
										</div>
									)}
								</div>
								<button
									className={`flex items-center gap-2 px-4 py-2 text-sm bg-white font-medium rounded border-2 transition ${isEdit
										? "border-green-500 text-green-600 hover:bg-green-50"
										: "border-gray-500 text-gray-600 hover:bg-gray-50"
										}`}
									onClick={() => setIsEdit(!isEdit)}
								>
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
						</div>
					)}
					{isShrinked && (
						<div className="size-16">
							<div className="fixed size-16 bg-gradient-to-br p-4 flex flex-row from-accent_3 via-accent_2 to-accent_1 rounded text-white justify-center">
								<button
									className="rounded-full p-2 absolute bg-accent_1 hover:bg-accent_3 "
									onClick={() => setIsShrinked(!isShrinked)}
								>
									<IoReorderThree size={20} />
								</button>
							</div>
						</div>
					)}

					<div className="flex flex-row flex-1 gap-8">
						<div className="flex flex-col flex-1 text-black gap-4 h-fit">
							<div className="flex flex-col md:flex-row justify-around  h-40 md:h-12">
								<div className="md:w-1/4 rounded drop-shadow-lg">
									<Autocomplete
										multiple
										limitTags={1}
										className="absolute inset-0"
										size="small"
										options={years.data ? years.data : []}
										disableCloseOnSelect
										getOptionLabel={(option) => option}
										onChange={(e, newValues) => setYearsSelect(newValues)}
										renderInput={(params) => (
											<TextField
												label="Year"
												className="bg-white rounded"
												{...params}
											/>
										)}
									/>
								</div>
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
											setTeamIDs([...newValues.map((value) => value.id)])
										}
										renderInput={(params) => (
											<TextField
												label="Team"
												className="bg-white rounded h-fit"
												{...params}
											/>
										)}
									/>
								</div>
								<div className=" md:w-1/3 rounded  drop-shadow-lg">
									<Autocomplete
										multiple
										limitTags={1}
										className="absolute inset-0"
										size="small"
										options={tournaments.data ? tournaments.data : []}
										disableCloseOnSelect
										getOptionLabel={(option) => option.name}
										onChange={(e, newValues) =>
											setTournamentIDs([...newValues.map((value) => value.id)])
										}
										renderInput={(params) => (
											<TextField
												label="Tournament"
												className="bg-white rounded"
												{...params}
											/>
										)}
									/>
								</div>
							</div>
							<h3 className="text-3xl font-semibold">Stats overview</h3>
							<div className="bg-white rounded self-center drop-shadow-lg mb-4">
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
							<div className={`grid grid-cols-1 sm:grid-cols-2 ${isShrinked ? "lg:grid-cols-7" : "lg:grid-cols-6"} gap-3`}>
								{(overviewOption == "Batting" ? [
									{
										label: "G",
										value: stats.data ? (
											stats.data.G
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
										label: "AVG",
										value: stats.data ? (
											stats.data.AVG.toFixed(3)
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
											stats.data.AB
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
											stats.data.OBP.toFixed(3)
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
											stats.data.SO
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
											stats.data.BB
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
											stats.data.H
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
											stats.data["1B"]
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
											stats.data["2B"]
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
											stats.data["3B"]
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
											stats.data.HR
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
											stats.data.PA
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
											stats.data.SLG.toFixed(3)
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
											stats.data.HBP
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
											stats.data.R
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
											stats.data.RBI
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
											stats.data.IBB
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
											stats.data.OPS.toFixed(3)
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
										label: "SB",
										value: stats.data ? (
											stats.data.SB
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
										label: "TB",
										value: stats.data ? (
											stats.data.TB
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
											stats.data.XBH
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
											stats.data.ROE
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
										label: "CS",
										value: stats.data ? (
											stats.data.CS
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
										label: "SF",
										value: stats.data ? (
											stats.data.SF
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
										label: "BABIP",
										value: stats.data ? (
											stats.data.BABIP.toFixed(3)
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
										label: "RC",
										value: stats.data ? (
											stats.data.RC.toFixed(3)
										) : stats.isLoading ? (
											<div >
												<CircularProgress color="success" />
											</div>
										) : (
											0
										),
										coefficient: true
									},


								] : [{
									label: "PO",
									value: stats.data ? (
										stats.data.PO
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
									label: "A",
									value: stats.data ? (
										stats.data.A
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
									label: "E",
									value: stats.data ? (
										stats.data.E
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
									label: "FIP",
									value: stats.data ? (
										stats.data.FIP.toFixed(3)
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
									label: "TC",
									value: stats.data ? (
										stats.data.TC
									) : stats.isLoading ? (
										<div >
											<CircularProgress color="success" />
										</div>
									) : (
										0
									),
									coefficient: false
								},]).sort((a, b) => b.label === "G" ? 1 : a.coefficient == b.coefficient ? a.label.localeCompare(b.label) : b.coefficient - a.coefficient).map((stat, index) => (
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
							{/* <div className="flex flex-col md:flex-row justify-around mb-4 h-40 md:h-12">
                            <div className="md:w-1/4 rounded drop-shadow-lg">
                                <Autocomplete
                                    multiple
                                    limitTags={1}
                                    className="absolute inset-0"
                                    size="small"
                                    options={years}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => (
                                        <TextField label="Year" className="bg-white rounded"{...params} />
                                    )}
                                />
                            </div>
                            <div className=" md:w-1/3 rounded  drop-shadow-lg">
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
                            <div className=" md:w-1/3 rounded  drop-shadow-lg">
                                <Autocomplete
                                    multiple
                                    limitTags={1}
                                    className="absolute inset-0"
                                    size="small"
                                    options={tournaments}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => (
                                        <TextField label="Tournament" className="bg-white rounded"{...params} />
                                    )}
                                />
                            </div>
                        </div> */}
							<div className="bg-white rounded self-center drop-shadow-lg">
								<ToggleButtonGroup color="primary" exclusive>
									<ToggleButton>Batting</ToggleButton>
									<ToggleButton>Pitching</ToggleButton>
									<ToggleButton>Fielding</ToggleButton>
								</ToggleButtonGroup>
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
								{games_stats.data &&
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
													{[...games_stats.data].sort((a, b) => { const res = ["homeTeam", "awayTeam"].includes(sortColumn) ? b[sortColumn].localeCompare(a[sortColumn]) : sortColumn == 'startTime' ? new Date(b[sortColumn]) - new Date(a[sortColumn]) : b.stats[sortColumn] - a.stats[sortColumn]; if (sortOrder == "ASC") return -res; return res; }).map((row) => (
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
																{stats.data ? stats.data.AB : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.R : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.H : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.RBI : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.BB : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.SO : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.AVG.toFixed(3) : 0}
															</div>
														</TableCell>
														<TableCell>
															<div className="font-semibold text-black text-sm">
																{stats.data ? stats.data.SLG.toFixed(3) : 0}
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
								{games_stats.data && (
									<LineChart
										xAxis={[
											{
												data: games_stats.data.map(
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
													games_stats.data.sort(
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
							<hr className="border-t-2 border-line"></hr>
							<h3 className="text-3xl font-semibold">Player comparison</h3>
							<div className="flex flex-col gap-4">
								<div className="flex flex-row justify-between">
									<button
										className={`${selectedPlayer ? "visible" : "invisible"
											} text-sm p-2 rounded drop-shadow-lg bg-accent_2 hover:bg-accent_3 text-white font-semibold`}
										onClick={() => setSelectedPlayer(null)}
									>
										CLEAR
									</button>
									<button
										className="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold text-base sm:text-lg md:text-xl"
										onClick={() => setSelectClicked(true)}
									>
										SELECT PLAYER
									</button>
								</div>
								<div className="bg-white rounded self-center drop-shadow-lg">
									<ToggleButtonGroup color="primary" exclusive>
										<ToggleButton>Batting</ToggleButton>
										<ToggleButton>Pitching</ToggleButton>
										<ToggleButton>Fielding</ToggleButton>
									</ToggleButtonGroup>
								</div>
								<div className="grid grid-cols-3 font-semibold text-xl ">
									<div className="text-center ">
										{player.data.firstName} {player.data.lastName}
									</div>
									<div></div>
									{selectedPlayer && (
										<div className="text-center">
											{selectedPlayer.firstName} {selectedPlayer.lastName}
										</div>
									)}
								</div>
								<div className="grid grid-cols-3 font-semibold bg-white px-6 py-3 rounded drop-shadow-lg">
									{[
										{
											player_1: stats.data ? stats.data.AB : 0,
											type: "AB",
											player_2:
												selectedPlayer && selectedPlayerStats
													? selectedPlayerStats.AB
													: undefined,
										}, {
											player_1: stats.data ? stats.data.H : 0,
											type: "H",
											player_2:
												selectedPlayer && selectedPlayerStats
													? selectedPlayerStats.H
													: undefined,
										},
										{
											player_1: stats.data ? stats.data.AVG.toFixed(3) : 0,
											type: "AVG",
											player_2:
												selectedPlayer && selectedPlayerStats
													? selectedPlayerStats.AVG.toFixed(3)
													: undefined,
										},
										{
											player_1: stats.data ? stats.data.OBP.toFixed(3) : 0,
											type: "OBP",
											player_2:
												selectedPlayer && selectedPlayerStats
													? selectedPlayerStats.OBP.toFixed(3)
													: undefined,
										},
										{
											player_1: stats.data ? stats.data.SLG.toFixed(3) : 0,
											type: "SLG",
											player_2:
												selectedPlayer && selectedPlayerStats
													? selectedPlayerStats.SLG.toFixed(3)
													: undefined,
										},
									].map((stat) => (
										<>
											<div
												className={`text-left border-r-2 p-1.5 ${stat.player_1 > stat.player_2
													? "bg-green-100"
													: stat.player_1 == stat.player_2
														? "bg-blue-100"
														: ""
													}`}
											>
												{stat.player_1}
											</div>
											<div className="text-center p-1.5">{stat.type}</div>
											<div
												className={`text-right border-l-2  p-1.5 ${stat.player_1 < stat.player_2
													? "bg-green-100"
													: stat.player_1 == stat.player_2
														? "bg-blue-100"
														: ""
													}`}
											>
												{stat.player_2}
											</div>
										</>
									))}
								</div>
							</div>
							{selectClicked && (
								<PlayerSelectList
									close={(player) => {
										setSelectClicked(false);
										setSelectedPlayer(player);
									}}
									players={
										players.data
											? players.data.filter((a) => a.id != player.data.id)
											: []
									}
									rosterSelect={false}
								/>
							)}
							{selectClicked && (
								<div className="fixed inset-0 z-10 bg-black bg-opacity-50"></div>
							)}
						</div>
						{isEdit && <InputFormPlayer close={() => setIsEdit(false)} isEdit={true} player={player.data ? player.data : {}} />}
						{isEdit && <div className="fixed inset-0 z-10 bg-black bg-opacity-50" ></div>}
					</div >
				</div >
			)
			}

		</div>
	);
}
