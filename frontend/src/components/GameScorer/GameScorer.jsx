import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import GameScorerHitOptions from "./GameScorerHitOptions";
import { useEffect, useState } from "react";
import GameScorerQuickOptions from "./GameScorerQuickOptions";
import GameScorerStrikeoutOptions from "./GameScorerStrikeoutOptions";
import GameScorerOutOptions from "./GameScorerOutOptions";
import GameScorerFlyoutOptions from "./GameScorerFlyoutOptions";
import GameScorerWalkOptions from "./GameScorerWalkOptions";
import GameScorerErrorOptions from "./GameScorerErrorOptions";
import GameScorerDroppedStrikeoutOptions from "./GameScorerDroppedStrikeoutOptions";
import GameScorerMoreOptions from "./GameScorerMoreOptions";
import { Tooltip, Zoom } from "@mui/material";
import GameScorerRunnerOptions from "./GameScorerRunnerOptions";
import { FiSettings } from "react-icons/fi";
import FieldCell from "./FieldCell";
import { GoDotFill } from "react-icons/go";
import GameScorerPlayByPlay from "./GameScorerPlayByPlay";
import GameScorerSettings from "./GameScorerSettings";
import GameScorerOutByRuleOptions from "./GameScorerOutByRuleOptions";
import useSWR from "swr";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function GameScorer() {
    const { id } = useParams();
    const [situationOption, setSituationOption] = useState("");
    const [points, setPoints] = useState({
        home: [], away: []
    });
    const [menuOption, setMenuOption] = useState(0);
    const clearOption = () => {
        if (runnerWindowCount > 1)
            setRunnerWindowCount(runnerWindowCount - 1);
        else {
            setSituationOption("");
            setIsSituationReady(true);
        }
    };
    const [battingTurn, setBattingTurn] = useState(1);
    const [homeBattingTurn, setHomeBattingTurn] = useState(1);
    const [awayBattingTurn, setAwayBattingTurn] = useState(1);
    const [roster, setRoster] = useState([]);
    const game = useSWR(`${HOST}/game/${id}`, (url) => fetch(url).then((res) => res.json()));
    const homeRosterData = useSWR(`${HOST}/game/team/roster/?game_id=${id}&home_away=HOME`, (url) => fetch(url).then((res) => res.json()));
    const awayRosterData = useSWR(`${HOST}/game/team/roster/?game_id=${id}&home_away=AWAY`, (url) => fetch(url).then((res) => res.json()));
    const situationsData = useSWR(`${HOST}/game/${id}/situations`, (url) => fetch(url).then((res) => res.json()));
    const [homeRoster, setHomeRoster] = useState([
        // { id: 121, battingOrder: 5, uniformNumber: 55, firstName: "Nikolay", lastName: "Mutafchiev", position: "CF" },
        // { id: 122, battingOrder: 2, uniformNumber: 12, firstName: "Ivan", lastName: "Petrov", position: "1B" },
        // { id: 123, battingOrder: 3, uniformNumber: 34, firstName: "Mario", lastName: "Ivanov", position: "SS" },
        // { id: 124, battingOrder: 4, uniformNumber: 7, firstName: "Georgi", lastName: "Dimitrov", position: "RF" },
        // { id: 125, battingOrder: 7, uniformNumber: 22, firstName: "Yao", lastName: "Kirilov", position: "2B" },
        // { id: 126, battingOrder: 6, uniformNumber: 10, firstName: "Peter", lastName: "Stoyanov", position: "3B" },
        // { id: 127, battingOrder: 1, uniformNumber: 3, firstName: "Georgi", lastName: "Todorov", position: "LF" },
        // { id: 128, battingOrder: 8, uniformNumber: 45, firstName: "Viktor", lastName: "Georgiev", position: "C" },
        // { id: 129, battingOrder: 9, uniformNumber: 88, firstName: "Ivan", lastName: "Mladenov", position: "DH" },
        // { id: 130, battingOrder: "Flex", uniformNumber: 99, firstName: "Dimitar", lastName: "Kolev", position: "P" },
    ]);
    const [awayRoster, setAwayRoster] = useState([
        // { id: 121, battingOrder: 5, uniformNumber: 55, firstName: "Kostadin", lastName: "Mutafchiev", position: "CF" },
        // { id: 122, battingOrder: 2, uniformNumber: 12, firstName: "Ivan", lastName: "Yordanov", position: "1B" },
        // { id: 123, battingOrder: 3, uniformNumber: 34, firstName: "Mario", lastName: "Ivanov", position: "SS" },
        // { id: 124, battingOrder: 4, uniformNumber: 71, firstName: "Georgi", lastName: "Vladimirov", position: "RF" },
        // { id: 125, battingOrder: 7, uniformNumber: 22, firstName: "Anton", lastName: "Kirilov", position: "2B" },
        // { id: 126, battingOrder: 6, uniformNumber: 10, firstName: "Peter", lastName: "Stoyanov", position: "3B" },
        // { id: 127, battingOrder: 1, uniformNumber: 3, firstName: "Ivan", lastName: "Todorov", position: "LF" },
        // { id: 128, battingOrder: 8, uniformNumber: 45, firstName: "Viktor", lastName: "Georgiev", position: "C" },
        // { id: 129, battingOrder: 9, uniformNumber: 88, firstName: "Petar", lastName: "Mladenov", position: "DH" },
        // { id: 130, battingOrder: "Flex", uniformNumber: 99, firstName: "Dimitar", lastName: "Kolev", position: "P" },
    ]);
    const [ballCount, setBallCount] = useState(0);
    const [strikeCount, setStrikeCount] = useState(0);
    const [homePoints, setHomePoints] = useState(0);
    const [awayPoints, setAwayPoints] = useState(0);
    const [homeHits, setHomeHits] = useState(0);
    const [awayHits, setAwayHits] = useState(0);
    const [homeErrors, setHomeErrors] = useState(0);
    const [awayErrors, setAwayErrors] = useState(0);
    const [homeLOB, setHomeLOB] = useState(0);
    const [awayLOB, setAwayLOB] = useState(0);
    const [outs, setOuts] = useState(0);
    const [situations, setSituations] = useState([]);
    const [runnersSituations, setRunnersSituations] = useState([]);
    const [currentSituation, setCurrentSituation] = useState({});
    const [isSituationReady, setIsSituationReady] = useState(null);
    const { token, logout } = useAuth();
    //function to set the next batter
    const nextBatter = () => {
        const newBatterTurn = battingTurn >= 9 ? 1 : battingTurn + 1;
        if (inningHalf == "UP")
            setAwayBattingTurn(newBatterTurn);
        else
            setHomeBattingTurn(newBatterTurn);
        fetch(`${HOST}/game/${id}/change_batting_turn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                homeAway: inningHalf == "UP" ? "AWAY" : "HOME",
                battingTurn: newBatterTurn
            })

        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));
        setBattingTurn(newBatterTurn);
    };

    const positionTextToAbbreviations = {
        pitcher: "P",
        catcher: "C",
        firstBaseman: "1B",
        secondBaseman: "2B",
        thirdBaseman: "3B",
        shortstop: "SS",
        leftFielder: "LF",
        centerFielder: "CF",
        rightFielder: "RF"
    }
    const positionAbbrevationsToValues = {
        "P": 1,
        "C": 2,
        "1B": 3,
        "2B": 4,
        "3B": 5,
        "SS": 6,
        "LF": 7,
        "CF": 8,
        "RF": 9
    }
    const positionValuesToAbbrevations = {
        "1": "P",
        "2": "C",
        "3": "1B",
        "4": "2B",
        "5": "3B",
        "6": "SS",
        "7": "LF",
        "8": "CF",
        "9": "RF"
    }
    const [inning, setInning] = useState(null);
    const [inningHalf, setInningHalf] = useState(null);
    const [offense, setOffense] = useState({
        firstBaseRunner: null, secondBaseRunner: null, thirdBaseRunner: null
    });
    const [batter, setBatter] = useState(null)
    //При всяка промяна на ростерите, те се ъпдейтват
    useEffect(() => {
        if (homeRosterData.data)
            setHomeRoster(homeRosterData.data);
        if (awayRosterData.data)
            setAwayRoster(awayRosterData.data);
    }, [homeRosterData.data, awayRosterData.data]);
    //При всяка промяна на списъка със ситуациите, той се ъпдейтва
    useEffect(() => {
        if (situationsData.data) {
            let newSituations = situationsData.data;
            newSituations = newSituations.sort((a, b) => b.id - a.id);
            setSituations(newSituations);
        }
    }, [situationsData.data]);
    //При всякаква промяна в играта, се ъпдейтват всички променливи
    useEffect(() => {
        if (game.data) {
            setInning(game.data.inning);
            setInningHalf(game.data.inningHalf);
            setOffense({
                firstBaseRunner: game.data.runners.firstBaseRunner,
                secondBaseRunner: game.data.runners.secondBaseRunner,
                thirdBaseRunner: game.data.runners.thirdBaseRunner
            });
            setHomeBattingTurn(game.data.homeBattingTurn);
            setAwayBattingTurn(game.data.awayBattingTurn);
            if (game.data.inningHalf == "UP")
                setBattingTurn(game.data.awayBattingTurn);
            else
                setBattingTurn(game.data.homeBattingTurn);
            setOuts(game.data.outs);
            setHomePoints(game.data.homeResult);
            setAwayPoints(game.data.awayResult);
            setPoints(game.data.pointsByInning);

            setHomeLOB(game.data.homeTeam.lob);
            setAwayLOB(game.data.awayTeam.lob);
            setHomeErrors(game.data.homeTeam.errors);
            setAwayErrors(game.data.awayTeam.errors);
            setHomeHits(game.data.homeTeam.hits);
            setAwayHits(game.data.awayTeam.hits);
        }

    }, [game.data])
    const [defense, setDefense] = useState(
        {
            pitcher: {

            },
            catcher: {

            },
            firstBaseman: {

            },
            secondBaseman: {

            },
            thirdBaseman: {

            },
            shortstop: {

            },
            leftFielder: {

            },
            centerFielder: {

            },
            rightFielder: {

            }
        }
    )
    const [takenPlayers, setTakenPlayers] = useState([]);

    const clearCount = () => {
        setStrikeCount(0);
        setBallCount(0);
    }
    //Функция за увеличаване на броя на аутовете
    const incrementOuts = async () => {
        if (outs + 1 == 3) {
            setOuts(3);
            setOffense({
                firstBaseRunner: null,
                secondBaseRunner: null,
                thirdBaseRunner: null
            });
            await fetch(`${HOST}/game/${id}/change_outs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    outs: 0
                })

            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));

            await fetch(`${HOST}/game/${id}/change_runners`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    runners: { "firstBaseRunner": null, "secondBaseRunner": null, "thirdBaseRunner": null }
                })

            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));


            if (inningHalf == "DOWN") {
                setHomeLOB(homeLOB + Object.entries(offense).filter(([position, player]) => player !== null).length);
                setInning(inning + 1);
                await fetch(`${HOST}/game/game_team/change_lob/?game_id=${id}&home_away=HOME`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lob: homeLOB + Object.entries(offense).filter(([position, player]) => player !== null).length
                    })

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));

            }

            else {
                setAwayLOB(awayLOB + Object.entries(offense).filter(([position, player]) => player !== null).length);
                await fetch(`${HOST}/game/game_team/change_lob/?game_id=${id}&home_away=AWAY`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lob: awayLOB + Object.entries(offense).filter(([position, player]) => player !== null).length
                    })

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

            }
            setInningHalf(inningHalf == "UP" ? "DOWN" : "UP");
            await fetch(`${HOST}/game/${id}/change_inning`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }

            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
        }
        else {
            setOuts(outs + 1);
            await fetch(`${HOST}/game/${id}/change_outs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    outs: outs + 1
                })

            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

        }
    }

    const situationAdder = () => {
        const newOuts = outs;
        setSituations([{ id: Infinity, data: { batter: currentSituation.batter, inning: currentSituation.inning, inningHalf: currentSituation.inningHalf, outs: newOuts, situation: currentSituation.situation, situationCategory: currentSituation.situationCategory, defense: currentSituation.defense, runners: runnersSituations, runs: runnersSituations.filter((runner) => runner.finalBase == "Home").length } }, ...situations]);
        fetch(`${HOST}/game/${id}/situation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                data: { batter: currentSituation.batter, inning: currentSituation.inning, inningHalf: currentSituation.inningHalf, outs: newOuts, situation: currentSituation.situation, situationCategory: currentSituation.situationCategory, defense: currentSituation.defense, runners: runnersSituations, runs: runnersSituations.filter((runner) => runner.finalBase == "Home").length }
            })

        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
        if (newOuts === 3) {
            setOuts(0);
        }
        setRunnersSituations([]);
        setCurrentSituation({});

    }
    //Добавя ситуация, ако има ситуация и няма ситуации, които чакат да бъдат обработени  
    useEffect((() => {
        if (isSituationReady == true && Object.keys(currentSituation).length != 0) {
            setRunnerWindowCount(0);
            situationAdder();
        }
    }), [isSituationReady, currentSituation]);
    //Задава ситуация, която в последствие да бъде добавена
    const addSituation = (currentBatter, situationCategory, situation, isOut = false, outs = [], assists = [], errors = []) => {
        setCurrentSituation({ batter: currentBatter, inning: inning, inningHalf: inningHalf, isOut: isOut, situation: situation, situationCategory: situationCategory, runners: runnersSituations, defense: { assists: assists, outs: outs, errors: errors } });

    }
    const [runnerWindowCount, setRunnerWindowCount] = useState(0);
    const [runnersToMove, setRunnersToMove] = useState([]);
    //Движи рънерите по базите
    const moveRunners = (bases, isBatterMoving = true) => {
        const movedRunnerFirst = getMovedRunner("1B", bases), movedRunnerSecond = getMovedRunner("2B", bases), movedRunnerThird = getMovedRunner("3B", bases);
        let runnersMove = [{ newBasePosition: "1B", player: movedRunnerFirst.player, oldBasePosition: movedRunnerFirst.basePosition },
        { newBasePosition: "2B", player: movedRunnerSecond.player, oldBasePosition: movedRunnerSecond.basePosition },
        { newBasePosition: "3B", player: movedRunnerThird.player, oldBasePosition: movedRunnerThird.basePosition },
        ...getScoringRunners(bases).map((player) => { return { newBasePosition: "Home", player: player.player, oldBasePosition: player.basePosition } })].filter((value) => !!value.player);
        if (!isBatterMoving)
            runnersMove = runnersMove.filter((runner) => runner.oldBasePosition != "Home");
        setRunnersToMove(runnersMove);
        setRunnerWindowCount(runnersMove.length);
        if (bases == 0)
            setIsSituationReady(true);
        if (runnersMove.length > 0) {
            setSituationOption("Runner");
            setIsSituationReady(false);
        }
        else
            setSituationOption("");

    }
    const runnersToBases = {
        firstBaseRunner: "1B",
        secondBaseRunner: "2B",
        thirdBaseRunner: "3B",
        batter: "Home"
    }
    const basesToRunners = {
        "1B": "firstBaseRunner",
        "2B": "secondBaseRunner",
        "3B": "thirdBaseRunner",
        "Home": "batter"
    }
    const positionNumbers = {
        "1": "pitcher",
        "2": "catcher",
        "3": "firstBaseman",
        "4": "secondBaseman",
        "5": "thirdBaseman",
        "6": "shortstop",
        "7": "leftFielder",
        "8": "centerFielder",
        "9": "rightFielder"
    }
    //Връща всички рънери, които ще отбележат задължително при даден брой бази
    const getScoringRunners = (bases) => {
        const isFirstOccupied = !!offense.firstBaseRunner, isSecondOccupied = !!offense.secondBaseRunner, isThirdOccupied = !!offense.thirdBaseRunner;
        switch (bases) {
            case 1: {
                if (isSecondOccupied && isThirdOccupied && isFirstOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }];
                return [];
            }
            case 2: {
                if (isThirdOccupied && isSecondOccupied && isFirstOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }, { basePosition: "2B", player: offense.secondBaseRunner }];
                else if (isSecondOccupied && isFirstOccupied)
                    return [{ basePosition: "2B", player: offense.secondBaseRunner }];
                else if (isThirdOccupied && isSecondOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }];
                return [];
            }
            case 3: {
                if (isThirdOccupied && isSecondOccupied && isFirstOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }, { basePosition: "2B", player: offense.secondBaseRunner }, { basePosition: "1B", player: offense.firstBaseRunner }];
                else if (isThirdOccupied && isSecondOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }, { basePosition: "2B", player: offense.secondBaseRunner }];
                else if (isThirdOccupied && isFirstOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }, { basePosition: "1B", player: offense.firstBaseRunner }];
                else if (isSecondOccupied && isFirstOccupied)
                    return [{ basePosition: "2B", player: offense.secondBaseRunner }, { basePosition: "1B", player: offense.firstBaseRunner }];
                else if (isThirdOccupied)
                    return [{ basePosition: "3B", player: offense.thirdBaseRunner }];
                else if (isSecondOccupied)
                    return [{ basePosition: "2B", player: offense.secondBaseRunner }];
                else if (isFirstOccupied)
                    return [{ basePosition: "1B", player: offense.firstBaseRunner }];
                else return [];

            }
            case 4: {
                return [{ basePosition: "Home", player: batter }, ...Object.entries(offense).filter(([key, value]) => !!value).map(([key, value]) => {
                    return { basePosition: (runnersToBases[key]), player: value }
                })];
            }
            default:
                return [];
        }
    }
    //Връща рънера, който ще се окаже на дадена база при определен брой бази за минаване
    const getMovedRunner = (position, bases) => {
        switch (position) {
            case "1B":
                return bases == 1 ? { basePosition: "Home", player: batter } : bases > 1 ? { player: null, basePosition: null } : { basePosition: "1B", player: offense.firstBaseRunner };
            case "2B":
                return offense.firstBaseRunner && bases == 1 ? { basePosition: "1B", player: offense.firstBaseRunner } : bases == 2 ? { basePosition: "Home", player: batter } : bases > 2 ? { player: null, basePosition: null } : { basePosition: "2B", player: offense.secondBaseRunner };
            case "3B": {
                if (offense.firstBaseRunner && offense.secondBaseRunner && bases == 1)
                    return { basePosition: "2B", player: offense.secondBaseRunner }
                else if (offense.firstBaseRunner && bases == 2)
                    return { basePosition: "1B", player: offense.firstBaseRunner }
                else if (offense.secondBaseRunner && bases == 2)
                    return { basePosition: "2B", player: offense.secondBaseRunner }
                else if (bases == 3)
                    return { basePosition: "Home", player: batter }
                else if (bases == 4)
                    return { player: null, basePosition: null };
                else
                    return { basePosition: "3B", player: offense.thirdBaseRunner };
            }
        }
    };

    const switchTeams = () => {

        clearCount();

        if (inningHalf == "UP") {
            setBattingTurn(awayBattingTurn)
        }
        else {
            setBattingTurn(homeBattingTurn)
        }
    }
    //Зарежда защитаващия и нападащия отбор
    const loadDefenseOffense = () => {
        let attackRoster, defenseRoster

        if (inningHalf == "UP") {
            setRoster(awayRoster);
            attackRoster = awayRoster;
            defenseRoster = homeRoster;
        } else {
            setRoster(homeRoster);
            attackRoster = homeRoster;
            defenseRoster = awayRoster;
        }
        setTakenPlayers(defenseRoster.map((player) => player.id))
        const newDefense = {};
        Object.keys(defense).forEach((position) => {
            var newPositionPlayer = defenseRoster.filter((player) => player.position === positionTextToAbbreviations[position]);
            if (newPositionPlayer.length == 0)
                newDefense[position] = {};
            else
                newDefense[position] = newPositionPlayer[0];
        });
        setDefense(newDefense);
        const newBatter =
            attackRoster.filter((player) => player.battingOrder == battingTurn)[0];
        setBatter(newBatter);
    }
    useEffect(() => loadDefenseOffense(), [homeRoster, awayRoster, battingTurn])
    useEffect((() => { switchTeams(); loadDefenseOffense() }), [inningHalf]);
    //Списъл с всички компоненти, които се отварят според дадена ситуация
    const situationComponents = {
        "Hit": <GameScorerHitOptions close={clearOption} situationFunction={(bases, hitType) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "hit", situation: hitType, finalBase: null }])
            addSituation(batter, "hit", hitType);
            moveRunners(bases);
            clearCount();
            nextBatter();
            if (inningHalf == "UP") {
                fetch(`${HOST}/game/game_team/change_hits/?game_id=${id}&home_away=AWAY`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        hits: awayHits + 1
                    })

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                setAwayHits(awayHits + 1);
            }
            else {
                fetch(`${HOST}/game/game_team/change_hits/?game_id=${id}&home_away=HOME`, {
                    method: "POST",
                    headers: {

                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        hits: homeHits + 1
                    })

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                setHomeHits(homeHits + 1);
            }

        }} />,
        "Quick": <GameScorerQuickOptions close={clearOption}
            nextBatter={() => nextBatter()}
            clearCount={() => clearCount()}
            incrementOuts={() => incrementOuts()}
            moveRunners={(bases) => moveRunners(bases)}
            addSituation={(situationCategory, situation, outs = [], assists = [], errors = []) => { setRunnersSituations([...runnersSituations, { player: batter, situation: situation, situationCategory: situationCategory, finalBase: null }]); addSituation(batter, situationCategory, situation, true, outs.map((out) => defense[positionNumbers[out]]), assists.map((assist) => defense[positionNumbers[assist]]), errors.map((error) => defense[positionNumbers[error]])) }} />,
        "Strikeout": <GameScorerStrikeoutOptions close={clearOption}
            situationFunction={(strikeoutType) => {
                setIsSituationReady(false);
                setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "strikeout", situation: strikeoutType, finalBase: null, }])
                addSituation(batter, "strikeout", strikeoutType, true, [defense.catcher]);
                clearCount();
                nextBatter();
                incrementOuts();
                setIsSituationReady(true);
            }}
        />,
        "Groundout": <GameScorerOutOptions close={clearOption} situationFunction={(positions, outs, assists) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "groundout", situation: `Groundout ${positions}`, finalBase: null }])
            addSituation(batter, "groundout", `Groundout ${positions}`, true, outs.map((out) => defense[positionNumbers[out]]), assists.map((assist) => defense[positionNumbers[assist]]));
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Flyout": <GameScorerFlyoutOptions close={clearOption} situation="Flyout" situationCode="F" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "flyout", situation: `Flyout ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "flyout", `Flyout ${positionValuesToAbbrevations[position]}`, true, [defense[positionNumbers[position]]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Sac flyout": <GameScorerFlyoutOptions close={clearOption} situation="Sacrifice fly" situationCode="SF" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "sacrifice flyout", situation: `Sacrificise flyout ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "sacrifice flyout", `Sacrificise flyout ${positionValuesToAbbrevations[position]}`, true, [defense[positionNumbers[position]]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Linedrive": <GameScorerFlyoutOptions close={clearOption} situation="Linedrive" situationCode="L" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "flyout", situation: `Linedrive  ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "flyout", `Linedrive ${positionValuesToAbbrevations[position]}`, true, [defense[positionNumbers[position]]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }
        } />,
        "Foul fly": <GameScorerFlyoutOptions close={clearOption} situation="Foul fly" situationCode="FF" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "flyout", situation: `Foul flyout ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "flyout", `Foul flyout ${positionValuesToAbbrevations[position]}`, true, [defense[positionNumbers[position]]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Pop fly": <GameScorerFlyoutOptions close={clearOption} situation="Pop fly" situationCode="P" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "flyout", situation: `Pop flyout ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "flyout", `Pop flyout ${positionValuesToAbbrevations[position]}`, true, [defense[positionNumbers[position]]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Infield fly": <GameScorerFlyoutOptions close={clearOption} situation="Infield fly" situationCode="IF" situationFunction={(position) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "flyout", situation: `Infield flyout ${positionValuesToAbbrevations[position]}`, finalBase: null }])
            addSituation(batter, "flyout", `Infield flyout ${positionValuesToAbbrevations[position]}`, true, defense[positionNumbers[position]]);
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "Walk": <GameScorerWalkOptions close={clearOption} situationFunction={(walkType) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "walk", situation: walkType, finalBase: null }]);
            addSituation(batter, "walk", walkType);
            moveRunners(1);
            clearCount();
            nextBatter();
        }} />,
        "Dropped 3rd": <GameScorerDroppedStrikeoutOptions close={clearOption} situationFunction={(droppedType) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "dropped 3rd", situation: droppedType, finalBase: null }]);
            addSituation(batter, "dropped 3rd", droppedType);
            moveRunners(1);
            clearCount();
            nextBatter();
        }} />,
        "Fielder's choice": <GameScorerOutOptions close={clearOption} situationFunction={(positions, outs, assists) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "fielder's choice", situation: `Fielder's choice ${positions}`, finalBase: null }])
            addSituation(batter, "fielder's choice", `Fielder's choice ${positions}`);
            moveRunners(1);
            clearCount();
            nextBatter();
        }} />,
        "Sac bunt": <GameScorerOutOptions close={clearOption} situationFunction={(positions, outs, assists) => {
            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "sacrifice bunt", situation: `Sacrifice bunt ${positions}`, finalBase: null }])
            addSituation(batter, "sacrifice bunt", `Sacrifice bunt ${positions}`, true, outs.map((out) => defense[positionNumbers[out]]), assists.map((assist) => defense[positionNumbers[assist]]));
            moveRunners(0);
            clearCount();
            nextBatter();
            incrementOuts();
        }} />,
        "GDP": <GameScorerOutOptions close={clearOption} />,
        "Error": <GameScorerErrorOptions close={clearOption}
            situationFunction={(errorSituation, assists, errors) => {
                setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "error", situation: errorSituation, finalBase: null }]);
                addSituation(batter, "error", errorSituation, false, [], assists.map((assist) => defense[positionNumbers[assist]]), errors.map((error) => defense[positionNumbers[error]]));
                moveRunners(1);
                clearCount();
                nextBatter();
                if (inningHalf == "DOWN") {
                    fetch(`${HOST}/game/game_team/change_errors/?game_id=${id}&home_away=AWAY`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            errors: awayErrors + 1
                        })

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                    setAwayErrors(awayErrors + 1);
                }
                else {
                    fetch(`${HOST}/game/game_team/change_errors/?game_id=${id}&home_away=HOME`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            errors: homeErrors + 1
                        })

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                    setHomeErrors(homeErrors + 1);
                }
            }} />,
        "Runner": <GameScorerRunnerOptions close={() => {
            if (runnerWindowCount > 1)
                setRunnerWindowCount(runnerWindowCount - 1);
            else {
                setSituationOption("");
                setIsSituationReady(true);
            }
        }} runner={runnersToMove[runnerWindowCount - 1]}
            situationFunction={async (player, situationCategory, situation, startBase, finalBase, isOut = false, outs = [], assists = [], errors = []) => {
                //addSituation(batter, situationCategory, situation, isOut, outs.map((out) => defense[positionNumbers[out]]), assists.map((assist) => defense[positionNumbers[assist]]), errors.map((error) => defense[positionNumbers[error]]));
                // if (situation == '')
                if (Object.keys(currentSituation).length == 0)
                    addSituation(batter, "", "");
                setRunnersSituations([...runnersSituations, { player: player, situationCategory: situationCategory, situation: situation, finalBase: finalBase, isOut: isOut, defense: { outs: outs.map((out) => defense[positionNumbers[out]]), assists: assists.map((assist) => defense[positionNumbers[assist]]), errors: errors.map((error) => defense[positionNumbers[error]]) } }]);
                const newOffense = { ...offense };
                if (finalBase != "Home" && (finalBase === "1B" || finalBase == "2B" || finalBase == "3B"))
                    newOffense[finalBase == "1B" ? "firstBaseRunner" : finalBase == "2B" ? "secondBaseRunner" : finalBase == "3B" ? "thirdBaseRunner" : ""] = player;

                if (finalBase == "Home") {
                    if (inningHalf == "UP") {
                        const newPoints = points.away;
                        newPoints[inning - 1] = points.away[inning - 1] + 1;
                        setAwayPoints(awayPoints + 1);
                        await fetch(`${HOST}/game/${id}/change_points_by_inning`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                points: { home: points.home, away: newPoints }
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                        setPoints({ home: points.home, away: newPoints })
                        await fetch(`${HOST}/game/game_team/change_score/?game_id=${id}&home_away=AWAY`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                homeAway: "AWAY",
                                points: 1
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

                    } else {
                        const newPoints = points.home;
                        newPoints[inning - 1] = points.home[inning - 1] + 1;
                        setHomePoints(homePoints + 1);
                        setPoints({ home: newPoints, away: points.away })
                        await fetch(`${HOST}/game/${id}/change_points_by_inning`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                points: { home: newPoints, away: points.away }
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

                        await fetch(`${HOST}/game/game_team/change_score/?game_id=${id}&home_away=HOME`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                homeAway: "HOME",
                                points: 1
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;


                    }
                }
                if (startBase !== finalBase && startBase != "Home") {
                    newOffense[startBase == "1B" ? "firstBaseRunner" : startBase == "2B" ? "secondBaseRunner" : startBase == "3B" ? "thirdBaseRunner" : ""] = null;
                }

                setOffense(newOffense);
                fetch(`${HOST}/game/${id}/change_runners`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        runners: newOffense
                    })

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

            }

            }
            occupiedBases={
                Object.entries(offense).map(([key, value]) => {
                    if (value)
                        return runnersToBases[key];
                    else
                        return null;
                }).filter((value) => !!value)
            }
            incrementOuts={async () => {
                if (outs + 1 == 3) {
                    setOuts(3);
                    setOffense({
                        firstBaseRunner: null,
                        secondBaseRunner: null,
                        thirdBaseRunner: null
                    });
                    await fetch(`${HOST}/game/${id}/change_outs`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            outs: 0
                        })

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                    await fetch(`${HOST}/game/${id}/change_runners`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            runners: { "firstBaseRunner": null, "secondBaseRunner": null, "thirdBaseRunner": null }
                        })

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

                    addSituation(batter, "", "");
                    setSituationOption("");
                    setIsSituationReady(true);
                    if (inningHalf == "DOWN") {
                        setHomeLOB(homeLOB + Object.entries(offense).filter(([position, player]) => player !== null).length);
                        setInning(inning + 1);
                        await fetch(`${HOST}/game/game_team/change_lob/?game_id=${id}&home_away=HOME`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                lob: homeLOB + Object.entries(offense).filter(([position, player]) => player !== null).length
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                    }
                    else {
                        setAwayLOB(awayLOB + Object.entries(offense).filter(([position, player]) => player !== null).length);
                        await fetch(`${HOST}/game/game_team/change_lob/?game_id=${id}&home_away=AWAY`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                lob: awayLOB + Object.entries(offense).filter(([position, player]) => player !== null).length
                            })

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;

                    }
                    setInningHalf(inningHalf == "UP" ? "DOWN" : "UP");
                    fetch(`${HOST}/game/${id}/change_inning`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                }
                else {
                    setOuts(outs + 1);
                    fetch(`${HOST}/game/${id}/change_outs`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            outs: outs + 1
                        })

                    }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                }
            }
            } />,
        "More": <GameScorerMoreOptions close={clearOption}
            outs={outs}
            changeOption={(newOption) => setSituationOption(newOption)}
            incrementOuts={() => incrementOuts()}
            moveRunners={moveRunners}
            clearCount={() => clearCount()}
            nextBatter={() => nextBatter()}
            addSituation={(situationCategory, situation) => { setRunnersSituations([...runnersSituations, { player: batter, situationCategory: situationCategory, situation: situation, finalBase: null }]); addSituation(batter, situationCategory, situation) }}
            occupiedBases={
                Object.entries(offense).map(([key, value]) => {
                    if (value)
                        return runnersToBases[key];
                    else
                        return null;
                }).filter((value) => !!value)
            }
            incrementBallCount={() => {
                if (ballCount == 3) {
                    setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "walk", situation: "Walk on balk", finalBase: "1B" }]);
                    addSituation(batter, "walk", "Walk");
                    moveRunners(1);
                }
                else {
                    // setRunnersSituations([...runnersSituations, { player: offense.batter, situationCategory: "", situation: "Ball on balk" }]);
                    setBallCount(ballCount + 1);
                }
            }}
        />,
        "Out by rule": <GameScorerOutByRuleOptions close={clearOption} />
    }
    return (
        <>
            {game.data && game.data.status === "live" &&
                <div className="w-full md:max-h-[90vh]  min-h-[90vh] flex flex-col md:flex-row">
                    <div className="md:w-7/12  flex flex-col bg-white">
                        <div className="h-fit w-full flex flex-row p-2 shadow-md">
                            <div className="w-1/5 flex flex-col bg-gray-100">
                                <div className="h-1/2 flex flex-row items-center justify-between p-2">
                                    <div className="flex flex-row items-center font-semibold gap-2">
                                        {game.data && <> <img className="size-[25px]" src={game.data.awayTeam.image ? game.data.awayTeam.image : " https://placehold.co/25x25"}>
                                        </img>
                                            <div>{game.data.awayTeam.tlc}</div></>}
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {awayPoints}
                                    </div>
                                </div>
                                <div className="h-1/2 flex flex-row items-center justify-between p-2">
                                    <div className="flex flex-row items-center font-semibold gap-2">
                                        {game.data && <> <img className="size-[25px]" src={game.data.homeTeam.image ? game.data.homeTeam.image : " https://placehold.co/25x25"}>
                                        </img>
                                            <div>{game.data.homeTeam.tlc}</div></>}
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {homePoints}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-200 flex flex-col w-1/4 text-sm font-semibold">
                                {Object.keys(defense.pitcher).length != 0 &&
                                    < div className="h-1/2 flex flex-row items-center justify-between p-2">
                                        {defense.pitcher.player && <div>
                                            {defense.pitcher.player.lastName}
                                        </div>}
                                        <div>
                                            P: 12
                                        </div>
                                    </div>
                                }
                                {batter &&
                                    <div className="h-1/2 flex flex-row items-center justify-between p-2">

                                        <div>
                                            {battingTurn}. {batter.player ? batter.player.lastName : ""}
                                        </div>
                                        <div>
                                            1 for 1
                                        </div>
                                    </div>}
                            </div>
                            <div className="flex-1 h-full flex flex-row">
                                <div className="relative bg-gray-400 w-1/5 ">
                                    <div className="mt-4 flex flex-row  items-center justify-center">
                                        <div className={`${offense.thirdBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} size-4 rotate-45 items-center justify-center`}>
                                        </div>
                                        <div className={`${offense.secondBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} mb-8 size-4 rotate-45 items-center justify-center`}>
                                        </div>
                                        <div className={`${offense.firstBaseRunner ? "bg-yellow-400" : "border-2 border-yellow-400"} size-4 rotate-45 items-center justify-center`}>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-center text-yellow-400">
                                        <GoDotFill size={15} className={`${outs > 0 ? "visible" : "invisible"}`} />
                                        <GoDotFill size={15} className={`${outs > 1 ? "visible" : "invisible"}`} />
                                    </div>

                                </div>
                                <div className="w-[12%] bg-blue-400 text-white flex flex-col items-center justify-around font-semibold">
                                    <div className=" flex flex-row items-center">
                                        {inning} {inningHalf == "UP" ? <FaCaretUp /> : <FaCaretDown />}
                                    </div>
                                    <div className="flex flex-row">
                                        {ballCount}-{strikeCount}
                                    </div>
                                </div>
                                <div className="flex flex-1 px-2">
                                    <table className="w-full table-auto  text-xs">
                                        <thead className="border-b-[1px] border-gray-500">
                                            <tr>
                                                {["Team", 1, 2, 3, 4, 5, 6, 7, 8, 9, "R", "H", "E", "LOB"].map((value) => <th className="p-1 font-bold">{value}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {game.data && <>
                                                <tr>
                                                    {[game.data.awayTeam.tlc, ...points.away, awayPoints, awayHits, awayErrors, awayLOB].map((value) => <td className="text-center font-semibold text-2xs">{value}</td>)}
                                                </tr>
                                                <tr>
                                                    {[game.data.homeTeam.tlc, ...points.home, homePoints, homeHits, homeErrors, homeLOB].map((value) => <td className="text-center font-semibold text-2xs">{value}</td>)}
                                                </tr></>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-row  items-center justify-center ">
                            <div className="w-[71%]  grid grid-cols-[repeat(30,minmax(0,1fr))] text-white font-semibold">
                                <div style={{ gridColumn: "span 14/ span 14" }}></div>
                                <FieldCell player={defense.centerFielder} takenPlayers={takenPlayers}
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
                                    } />
                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div style={{ gridColumn: "span 2/ span 2" }}></div>
                                <FieldCell player={defense.leftFielder} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 22/ span 2" }}></div>
                                <FieldCell player={defense.rightFielder} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 2/ span 2" }}></div>

                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div style={{ gridColumn: "span 10/ span 10" }}></div>
                                <FieldCell player={defense.shortstop} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 2/ span 2" }}></div>
                                <div onClick={() => { if (offense.secondBaseRunner) { setRunnerWindowCount(1); setRunnersToMove([{ oldBasePosition: "2B", newBasePosition: "2B", player: offense.secondBaseRunner }]); setSituationOption("Runner"); } }} className={`${offense.secondBaseRunner ? "bg-accent_1" : "border-4 border-accent_1"} col-span-2 size-10 cursor-pointer content-center text-center rounded drop-shadow-md`}>
                                    {offense.secondBaseRunner && <Tooltip
                                        title={<div className="text-xs">{offense.secondBaseRunner.player.firstName} {offense.secondBaseRunner.player.lastName}</div>}
                                        arrow
                                        placement='top'
                                        slots={{
                                            transition: Zoom,
                                        }}

                                    >
                                        {offense.secondBaseRunner.uniformNumber}
                                    </Tooltip>
                                    }
                                </div>
                                <div style={{ gridColumn: "span 2/ span 2" }}></div>
                                <FieldCell player={defense.secondBaseman} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 10/ span 10" }}></div>

                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div style={{ gridColumn: "span 7/ span 7" }}></div>
                                <FieldCell player={defense.thirdBaseman} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 12/ span 12" }}></div>
                                <FieldCell player={defense.firstBaseman} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 7/ span 7" }}></div>

                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div style={{ gridColumn: "span 6/ span 6" }}></div>
                                <div onClick={() => {
                                    if (offense.thirdBaseRunner) { setRunnerWindowCount(1); setRunnersToMove([{ oldBasePosition: "3B", newBasePosition: "3B", player: offense.thirdBaseRunner }]); setSituationOption("Runner"); }
                                }} className={`${offense.thirdBaseRunner ? "bg-accent_1" : "border-4 border-accent_1"} col-span-2 size-10 cursor-pointer content-center text-center rounded drop-shadow-md`}>
                                    {offense.thirdBaseRunner && <Tooltip
                                        title={<div className="text-xs">{offense.thirdBaseRunner.player.firstName} {offense.thirdBaseRunner.player.lastName}</div>}
                                        arrow
                                        placement='top'
                                        slots={{
                                            transition: Zoom,
                                        }}
                                    >
                                        {offense.thirdBaseRunner.uniformNumber}
                                    </Tooltip>}</div>
                                <div style={{ gridColumn: "span 6/ span 6" }}></div>
                                <FieldCell player={defense.pitcher} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 6/ span 6" }}></div>
                                <div onClick={() => { if (offense.firstBaseRunner) { setRunnerWindowCount(1); setRunnersToMove([{ oldBasePosition: "1B", newBasePosition: "1B", player: offense.firstBaseRunner }]); setSituationOption("Runner"); } }} className={`${offense.firstBaseRunner ? "bg-accent_1" : "border-4 border-accent_1"} col-span-2 size-10 cursor-pointer content-center text-center rounded drop-shadow-md`}>
                                    {offense.firstBaseRunner && <Tooltip
                                        title={<div className="text-xs">{offense.firstBaseRunner.player.firstName} {offense.firstBaseRunner.player.lastName}</div>}
                                        arrow
                                        placement='top'
                                        slots={{
                                            transition: Zoom,
                                        }}
                                    >
                                        {offense.firstBaseRunner.uniformNumber}
                                    </Tooltip>}</div>
                                <div style={{ gridColumn: "span 6/ span 6" }}></div>

                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>
                                <div className="size-4" style={{ gridColumn: "span 30/ span 30" }}></div>

                                <div style={{ gridColumn: "span 11/ span 11" }}></div>
                                <div className={`${batter ? "bg-accent_1" : "border-4 border-accent_1"} col-span-2 size-10 cursor-pointer content-center text-center rounded drop-shadow-md`}>
                                    {batter && <Tooltip
                                        title={<div className="text-xs">{batter.player.firstName} {batter.player.lastName}</div>}
                                        arrow
                                        placement='top'
                                        slots={{
                                            transition: Zoom,
                                        }}
                                    >
                                        {batter.uniformNumber}
                                    </Tooltip>}</div>
                                <div style={{ gridColumn: "span 1/ span 1" }}></div>
                                <FieldCell player={defense.catcher} takenPlayers={takenPlayers}
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
                                    } />
                                <div style={{ gridColumn: "span 1/ span 1" }}></div>
                                {/* <div className="bg-accent_1 col-span-2 size-10 cursor-pointer content-center text-center rounded drop-shadow-md"><Tooltip
                                title={<div className="text-xs">Nikolay Mutafchiev</div>}
                                arrow
                                placement='top'
                                slots={{
                                    transition: Zoom,
                                }}
                            >
                                31
                            </Tooltip></div> */}
                                <div style={{ gridColumn: "span 11/ span 11" }}></div>

                            </div>
                        </div>


                    </div>
                    <div className="md:border-l-[1.5px] border-t-[1.5px] md:border-t-0  border-black md:w-5/12 flex flex-col  bg-gray-100">
                        <div className="flex flex-row justify-between gap-2 text-white font-semibold text-xl mx-2 my-2 ">
                            <Link to={"roster"} className="w-2/5 bg-cyan-600 hover:bg-cyan-500 text-center content-center rounded  py-1">
                                ROSTERS
                            </Link>
                            <button className="w-2/5 bg-cyan-600 hover:bg-cyan-500 text-center content-center rounded py-1" onClick={() => setMenuOption(menuOption == 0 ? 1 : 0)}>
                                {!menuOption ? "PLAY BY PLAY" : "SCORE MENU"}
                            </button>

                            <button className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 flex-1 flex items-center justify-center rounded " onClick={() => setMenuOption(2)}>
                                <FiSettings size={20} />
                            </button>
                        </div>
                        {menuOption == 0 && <>
                            <div className="flex flex-row border-2 min-h-[70px] max-h-[90px] justify-between items-center border-gray-300 rounded mx-2 p-3 bg-white drop-shadow-sm text-xs font-semibold ">
                                {situations[0] && situations[0].data && <> <div className="flex flex-col w-4/5 gap-2">
                                    <div className="flex flex-row  gap-6 ">
                                        {situations[0].data.batter && <div>
                                            Batter: #{situations[0].data.batter.uniformNumber} {situations[0].data.batter.player.firstName} {situations[0].data.batter.player.lastName}
                                        </div>
                                        }
                                    </div>
                                    <div className="text-2xs flex flex-row flex-wrap gap-x-1">
                                        {situations[0].data.runners.map((runner) => <div>#{runner.player.uniformNumber} {runner.player.player.lastName} {runner.situation} {runner.finalBase}</div>)}
                                    </div>
                                </div>
                                    <div className="flex flex-col gap-2 w-1/5">
                                        <div className="flex flex-row justify-center">
                                            {situations[0].data.inning} {situations[0].data.inningHalf == "UP" ? <FaCaretUp className="text-green-500" size={15} /> : <FaCaretDown className="text-red-500" size={15} />}
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <div>
                                                Runs: {situations[0].data.runs}
                                            </div>
                                            <div>
                                                Outs: {situations[0].data.outs}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                }
                            </div>
                            <div className="w-full h-full grid grid-cols-2 grid-rows-8 px-2 py-4 gap-x-3 gap-y-3 text-xl font-semibold text-white">
                                <button className="bg-primary_2 hover:bg-primary_2_hover flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Hit")}><div>H</div><div>Hit</div></button>
                                <button className="bg-red-500 hover:bg-red-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Groundout")}><div></div><div>Groundout</div></button>
                                <button className="bg-primary_2 hover:bg-primary_2_hover  flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded"
                                    onClick={() => {
                                        setSituationOption("Walk")
                                    }}
                                ><div>BB</div><div>Walk</div></button>
                                <button className="bg-red-500 hover:bg-red-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Flyout")}><div>F</div><div>Flyout</div></button>
                                <button className="bg-primary_2 hover:bg-primary_2_hover  flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => {
                                    setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "hit by pitch", situation: "Hit by pitch", finalBase: null }]);
                                    addSituation(batter, "hit by pitch", "Hit by pitch");
                                    moveRunners(1);
                                    nextBatter();
                                }}><div>HBP</div><div>Hit by pitch</div></button>
                                <button className="bg-red-500 hover:bg-red-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Strikeout")}><div>K</div><div>Strikeout</div></button>
                                <button className={`${!offense.firstBaseRunner || (!!offense.firstBaseRunner && outs == 2) ? "bg-primary_2 hover:bg-primary_2_hover" : "bg-primary_1 text-gray-400 pointer-events-none"}  flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded`} onClick={() => setSituationOption("Dropped 3rd")}><div></div><div>Dropped 3rd strike</div></button>
                                <button className="bg-red-500 hover:bg-red-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Sac flyout")}><div>SF</div><div>Sacrifice fly</div></button>
                                <button className="bg-yellow-500 hover:bg-yellow-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Fielder's choice")}><div>FC</div><div>Fielder's choice</div></button>
                                <button className="bg-red-500 hover:bg-red-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Linedrive")}><div>L</div><div>Linedrive</div></button>
                                <button className="bg-yellow-500 hover:bg-yellow-400 flex flex-row px-2 justify-between items-center transform transition-transform hover:scale-105 rounded " onClick={() => setSituationOption("Error")}><div>E</div><div>Error</div></button>
                                <button className={`${outs < 2 && Object.entries(offense).filter(([key, value]) => !!value).length > 0 ? "bg-red-500 hover:bg-red-400 transform transition-transform hover:scale-105" : "bg-red-700 text-gray-400 pointer-events-none"} flex flex-row px-2 justify-between items-center  rounded`} onClick={() => setSituationOption("GDP")}><div></div><div>GDP</div></button>
                                <button className="bg-blue-500 hover:bg-blue-400 text-center place-content-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("Quick")}>Quick</button>

                                <button className="bg-slate-500 hover:bg-slate-400 text-center place-content-center transform transition-transform hover:scale-105 rounded" onClick={() => setSituationOption("More")}>More...</button>
                                <div className="grid grid-cols-2 gap-x-1">
                                    <button className="bg-primary_2 hover:bg-primary_2_hover  py-1 text-center place-content-center rounded text-base" onClick={() => {
                                        if (ballCount == 3) {
                                            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "walk", situation: "Walk", finalBase: null }]);
                                            addSituation(batter, "walk", "Walk");
                                            moveRunners(1);
                                            nextBatter();
                                            clearCount();
                                        }
                                        else
                                            setBallCount(ballCount + 1)
                                    }}>Ball</button>
                                    <button className="bg-yellow-500 hover:bg-yellow-400 py-1 text-center place-content-center rounded text-base" onClick={() => { if (strikeCount < 2) setStrikeCount(strikeCount + 1) }}>Foulball</button>
                                </div>
                                <div className="grid grid-cols-2 gap-x-1">
                                    <button className="bg-red-500 hover:bg-red-400 py-1 text-center place-content-center rounded text-base" onClick={() => {
                                        if (strikeCount == 2) {
                                            setIsSituationReady(false);
                                            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "strikeout", situation: "Strikeout looking", finalBase: null }])
                                            addSituation(batter, "strikeout", "Strikeout looking", true, [defense.catcher]);
                                            nextBatter();
                                            incrementOuts();
                                            clearCount();
                                            setIsSituationReady(true);
                                        }
                                        else
                                            setStrikeCount(strikeCount + 1)
                                    }}>Called strike</button>
                                    <button className="bg-red-500 hover:bg-red-400 py-1 text-center place-content-center rounded text-base" onClick={() => {
                                        if (strikeCount == 2) {
                                            setIsSituationReady(false);
                                            setRunnersSituations([...runnersSituations, { player: batter, situationCategory: "strikeout", situation: "Strikeout swinging", finalBase: null }])
                                            addSituation(batter, "strikeout", "Strikeout swinging", true, [defense.catcher]);
                                            nextBatter();
                                            incrementOuts();
                                            clearCount();
                                            setIsSituationReady(true);
                                        }
                                        else
                                            setStrikeCount(strikeCount + 1)
                                    }}>Swinging strike</button>
                                </div>
                            </div>
                        </>}
                        {menuOption == 1 && <GameScorerPlayByPlay situations={situations} />}
                        {menuOption == 2 && <GameScorerSettings />}
                    </div>
                </div >
            }
            {game.data && game.data.status === "scheduled" && <div className="w-screen h-[60vh] text-4xl content-center text-center">Cannot score not started game!</div>}
            {game.data && game.data.status === "ended" && <div className="w-screen h-[80vh] text-4xl flex flex-col justify-center items-center gap-6">The game is over!
                <Link to={`/games/${game.data.id}`} className="bg-blue-500 hover:bg-blue-400 p-4 text-xl text-white drop-shadow-lg rounded font-semibold">Game info</Link></div>}
            {situationOption !== "" && situationComponents[situationOption]
            }

        </>)
}