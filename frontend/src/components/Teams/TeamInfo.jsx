import { FaFacebook, FaInstagram, FaLink, FaYoutube } from "react-icons/fa";
import {
	Autocomplete,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { IoReorderThree } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { RiSaveLine } from "react-icons/ri";
import TeamSelectList from "../Other/TeamSelectList";
import { LineChart } from "@mui/x-charts";
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
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { HOST } from "../../host";
export default function TeamInfo() {
	const { id } = useParams();
	const icons = {
		facebook: <FaFacebook size={30} />,
		instagram: <FaInstagram size={30} />,
		website: <FaLink size={30} />,
		youtube: <FaYoutube size={30} />,
	};
	const [isEdit, setIsEdit] = useState(false);
	const team = useSWR(`${HOST}/team/${id}`, (url) =>
		fetch(url).then((res) => res.json())
	);
	const [isShrinked, setIsShrinked] = useState(false);

	const [teamIDs, setTeamIDs] = useState([]);
	const [tournamentIDs, setTournamentIDs] = useState([]);
	const [yearsSelect, setYearsSelect] = useState([]);
	const [tableOption, setTableOption] = useState("Games");
	const query_params = {
		tournament_query:
			tournamentIDs.length != 0 ? `tournament_ids=[${tournamentIDs}]` : "",
		team_query: teamIDs.length != 0 ? `team_ids=[${teamIDs}]` : "",
		year_query: yearsSelect.length != 0 ? `years=[${yearsSelect}]` : "",
	};
	const get_query = (tournament, team, year, h2h = null) => {
		var res = "";
		if (tournament == true && query_params.tournament_query.length != 0)
			res += `?${query_params.tournament_query}`;
		if (team == true && query_params.team_query.length != 0)
			res += `${res.length == 0 ? "?" : "&"}${query_params.team_query}`;
		if (year == true && query_params.year_query.length != 0)
			res += `${res.length == 0 ? "?" : "&"}${query_params.year_query}`;
		if (h2h) res += `${res.length == 0 ? "?" : "&"}team_ids=[${h2h}]`;
		return res;
	};
	const [overviewOption, setOverviewOption] = useState("Batting");
	const years = useSWR(
		`${HOST}/team/${id}/years/${get_query(true, true, false)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const teams = useSWR(
		`${HOST}/team/${id}/teams/${get_query(true, false, true)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const tournaments = useSWR(
		`${HOST}/team/${id}/tournaments/${get_query(
			false,
			true,
			true
		)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const stats = useSWR(
		`${HOST}/team/${id}/stats/${get_query(true, true, true)}`,
		(url) => fetch(url).then((res) => res.json())
	);
	const teamsToSelect = useSWR(`${HOST}/team/teams`, (url) =>
		fetch(url).then((res) => res.json())
	);

	const [selectedTeam, setSelectedTeam] = useState(null);
	const [selectedTeamStats, setSelectedTeamStats] = useState(null);
	const [selectClicked, setSelectClicked] = useState(false);
	const teamH2Hstats = useSWR(
		`${HOST}/team/${id}/stats/${get_query(
			true,
			false,
			true,
			selectedTeam ? selectedTeam.id : null
		)}`,
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
	useEffect(() => {
		if (selectedTeam)
			fetch(
				`${HOST}/team/${selectedTeam.id}/stats/${get_query(
					true,
					false,
					true,
					team.data ? team.data.id : null
				)}`
			)
				.then((response) => response.json())
				.then((data) => {
					setSelectedTeamStats(data);
				})
				.catch((error) => console.error(error));
		else setSelectedTeamStats(null);
	}, [selectedTeam, tournamentIDs, yearsSelect]);
	return (
		<>
			{team.data && (
				<div className="w-full h-full flex flex-col md:flex-row gap-4">
					{!isShrinked && (
						<div className="w-full md:w-1/5 h-fit ">
							<div className="items-center flex flex-col gap-4 bg-white drop-shadow-lg p-2">
								<button
									className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1"
									onClick={() => setIsShrinked(!isShrinked)}
								>
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
								<div className="w-10/12  flex flex-row justify-around mt-2">
									{Object.entries(team.data.socialMedia)
										.filter(([media, page]) => page !== "")
										.map(([media, page]) => (
											<a href={page} target="_blank">
												{icons[media]}
											</a>
										))}
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
						<div className="relative size-11 ">
							<div className="fixed size-11 bg-white drop-shadow-lg p-2">
								<button
									className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1"
									onClick={() => setIsShrinked(!isShrinked)}
								>
									<IoReorderThree size={20} />
								</button>
							</div>
						</div>
					)}
					<div className="flex flex-1 flex-row gap-8">
						<div className="flex flex-1 flex-col gap-4 h-fit">
							<div className="flex flex-col md:flex-row justify-around h-40 mb-4 md:h-12">
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
											setTournamentIDs(newValues.map((value) => value.id))
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
							<div className="bg-white rounded self-center drop-shadow-lg my-2">
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
							<div className={`grid grid-cols-1 sm:grid-cols-2 ${isShrinked ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3`}>
								{(overviewOption == "Batting" ? [
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
									{
										label: "CS",
										value: stats.data ? (
											stats.data.stats.CS
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
											stats.data.stats.SF
										) : stats.isLoading ? (
											<div >
												<CircularProgress color="success" />
											</div>
										) : (
											0
										),
										coefficient: false
									}] : [
									{
										label: "PO",
										value: stats.data ? (
											stats.data.stats.PO
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
											stats.data.stats.A
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
											stats.data.stats.E
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
										label: "TC",
										value: stats.data ? (
											stats.data.stats.TC
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
											stats.data.stats.FIP.toFixed(3)
										) : stats.isLoading ? (
											<div >
												<CircularProgress color="success" />
											</div>
										) : (
											0
										),
										coefficient: true
									},
								]).sort((a, b) => a.coefficient == b.coefficient ? a.label.localeCompare(b.label) : b.coefficient - a.coefficient).map((stat, index) => (
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
							<hr className="border-t-2 border-line"></hr>
							<h3 className="text-3xl font-semibold">Team H2H</h3>
							<div className="flex flex-col">
								<div className="flex flex-row justify-between">
									<button
										className={`${selectedTeam ? "visible" : "invisible"
											} text-sm p-2 rounded drop-shadow-lg bg-accent_2 hover:bg-accent_3 text-white font-semibold`}
										onClick={() => setSelectedTeam(null)}
									>
										CLEAR
									</button>
									<button
										className="w-fit flex flex-row items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary_2 hover:bg-primary_3 font-semibold text-base sm:text-lg md:text-xl"
										onClick={() => setSelectClicked(true)}
									>
										SELECT TEAM
									</button>
								</div>
								<div className="bg-white p-4 h-28 rounded-2xl shadow-lg flex flex-col justify-between w-1/2 items-center self-center">
									<div className="text-2xl font-bold text-gray-800">W-L</div>
									{teamH2Hstats.data && selectedTeamStats && (
										<div className="text-5xl font-semibold text-gray-700">
											{teamH2Hstats.data.stats.W}-{selectedTeamStats.stats.W}
										</div>
									)}
								</div>
								<div>
									{/* <h5 className="text-2xl font-semibold">H2H stats</h5> */}
									<div className="grid grid-cols-3  font-semibold text-xl my-2">
										<div className="text-center">{team.data.name}</div>
										<div></div>
										{selectedTeam && (
											<div className="text-center">{selectedTeam.name}</div>
										)}
									</div>
									<div className="grid grid-cols-3 font-semibold bg-white px-6 py-3 rounded drop-shadow-lg">
										{[
											{
												team1: teamH2Hstats.data ? teamH2Hstats.data.stats.AB : 0,
												type: "AB",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.AB
														: undefined,
											}, , {
												team1: teamH2Hstats.data ? teamH2Hstats.data.stats.H : 0,
												type: "H",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.H
														: undefined,
											},
											{
												team1: teamH2Hstats.data
													? teamH2Hstats.data.stats.AVG.toFixed(3)
													: 0,
												type: "AVG",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.AVG.toFixed(3)
														: undefined,
											},
											{
												team1: teamH2Hstats.data
													? teamH2Hstats.data.stats.OBP.toFixed(3)
													: 0,
												type: "OBP",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.OBP.toFixed(3)
														: undefined,
											},
											{
												team1: teamH2Hstats.data
													? teamH2Hstats.data.stats.SLG.toFixed(3)
													: 0,
												type: "SLG",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.SLG.toFixed(3)
														: undefined,
											},
											{
												team1: teamH2Hstats.data
													? teamH2Hstats.data.stats.FIP.toFixed(3)
													: 0,
												type: "FIP",
												team2:
													selectedTeam && selectedTeamStats
														? selectedTeamStats.stats.FIP.toFixed(3)
														: undefined,
											}
										].map((stat) => (
											<>
												<div
													className={`text-left border-r-2 p-1.5 ${stat.team1 > stat.team2
														? "bg-green-100"
														: stat.team1 == stat.team2
															? "bg-blue-100"
															: ""
														}`}
												>
													{stat.team1}
												</div>
												<div className="text-center p-1.5">{stat.type}</div>
												<div
													className={`text-right border-l-2  p-1.5 ${stat.team1 < stat.team2
														? "bg-green-100"
														: stat.team2 == stat.team1
															? "bg-blue-100"
															: ""
														}`}
												>
													{stat.team2}
												</div>
											</>
										))}
									</div>
								</div>
								{/* <div>
                  <h6 className="text-lg font-semibold">Last 5 games</h6>
                  <div className="flex flex-col w-full gap-2">
                    {[
                      {
                        id: 1,
                        datetime: "2024-01-15T18:00:00Z",
                        isAdmin: true,
                        home: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Levski FC",
                          result: 2,
                        },
                        away: {
                          logo: "https://placehold.co/40x40",
                          teamName: "CSKA Sofia",
                          result: 1,
                        },
                        status: "ended",
                      },
                      {
                        id: 2,
                        datetime: "2024-01-16T15:30:00Z",
                        home: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Ludogorets",
                          result: 3,
                        },
                        away: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Beroe",
                          result: 3,
                        },
                        status: "live",
                      },
                      {
                        id: 3,
                        datetime: "2024-01-17T20:00:00Z",
                        isAdmin: true,
                        home: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Cherno More",
                          result: 0,
                        },
                        away: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Lokomotiv Plovdiv",
                          result: 0,
                        },
                        status: "scheduled",
                      },
                      {
                        id: 4,
                        datetime: "2024-01-18T12:00:00Z",
                        home: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Botev Plovdiv",
                          result: 1,
                        },
                        away: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Arda Kardzhali",
                          result: 2,
                        },
                        status: "ended",
                      },
                      {
                        id: 5,
                        datetime: "2024-01-19T19:45:00Z",
                        home: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Slavia Sofia",
                          result: 0,
                        },
                        away: {
                          logo: "https://placehold.co/40x40",
                          teamName: "Etar Veliko Tarnovo",
                          result: 1,
                        },
                        status: "live",
                      },
                    ].map((game) => (
                      <div className="w-full flex flex-row justify-around px-8 py-2 rounded items-center text-gray-500 bg-white  font-semibold  drop-shadow-xl">
                        <div className="w-1/5 flex flex-col gap-2 items-center">
                          <div className=" font-semibold text-2xs">
                            {new Date(game.datetime).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-row justify-around items-center w-[70%]">
                          <div className="w-[20%] text-xs flex flex-row gap-4 items-center">
                            <div className="w-1/2 text-center">
                              {game.home.teamName}
                            </div>
                            <img src={game.home.logo}></img>
                          </div>
                          <div className="text-xl font-bold w-[10%]">
                            {game.home.result} - {game.away.result}
                          </div>
                          <div className="w-[20%] text-xs flex flex-row gap-4 items-center">
                            <img src={game.away.logo}></img>
                            <div className="w-1/2 text-center text-xs">
                              {game.away.teamName}
                            </div>
                          </div>
                        </div>
                        <Link
                          className="w-[10%] py-2 rounded bg-blue-500 hover:bg-blue-400 text-white text-xs ease-in-out text-center duration-150"
                          to={`/games/${game.id}`}
                        >
                          More Info
                        </Link>
                      </div>
                    ))}
                  </div>
                </div> */}
							</div>
						</div>
					</div>
				</div>
			)}
			{selectClicked && (
				<TeamSelectList
					teams={
						teamsToSelect.data
							? teamsToSelect.data.filter((a) => a.id != team.data.id)
							: []
					}
					close={(team) => {
						setSelectedTeam(team);
						setSelectClicked(false);
					}}
					adder={false}
				/>
			)}
		</>
	);
}
