import GameList from "../Games/GameList";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    useState, useEffect
} from "react";
import dayjs from "dayjs";
import useSWR from "swr";
import { HOST } from "../../host";
export default function Schedule() {
    const [date, setDate] = useState(dayjs());
    const games = useSWR(`${HOST}/schedule/?year=${new Date(date).getFullYear()}&month=${new Date(date).getMonth() + 1}&day=${new Date(date).getDate()}`, (url) => fetch(url).then((res) => res.json()));
    const tournaments = games.data ? new Map(games.data.map((game) => [game.tournament.id, game.tournament.name])) : new Map();
    return (
        <div className="flex flex-col">
            <div className="w-full flex flex-row mb-10 px-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={date} onChange={(newValue) => setDate(newValue)} format="DD/MM/YYYY" label="Pick date" className="bg-white rounded" />
                </LocalizationProvider>
            </div>
            {Array.from(tournaments).map(([id, name]) =>
                <div className="flex flex-col gap-6">
                    <h1 className="text-xl md:text-3xl font-semibold">{name}</h1>
                    <GameList size="normal" games={games.data.filter((game) => game.tournament.id == id)} />
                    <Link className="w-3/5 md:w-1/5 md:text-xl text-white font-semibold bg-accent_2 hover:bg-accent_3 p-3 self-end rounded text-center" to={`/tournaments/${id}/games`}>View tournament info</Link>
                </div>
            )}
            {tournaments.size == 0 && <div className="text-2xl">Oops, no games are scheduled on this day!</div>}
        </div>)
}