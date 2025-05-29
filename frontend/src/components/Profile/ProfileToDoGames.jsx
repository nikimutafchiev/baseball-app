import { useAuth } from "../../AuthContext"
import useSWR from "swr";
import { HOST } from "../../host";
export default function ProfileToDoGames() {
    const { user } = useAuth();
    const toDoGames = useSWR(`${HOST}/game/to_do_games/?user_id=${user.id}`, (url) => fetch(url).then((res) => res.json()));
    return (<div className="w-full flex flex-col ">
        <h2 className="text-2xl font-semibold">To do list</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-5 ">
            {toDoGames.data && toDoGames.data.map((game) => <div className=" h-[240px] flex flex-col justify-around py-2 rounded items-center text-gray-500 bg-white  font-semibold drop-shadow-md">
                <div className="flex flex-col text-gray-500 text-2xs font-semibold ">
                    <div className="text-center">
                        {game.venue}
                    </div>
                    <div className="text-center">
                        {new Date(game.startTime).toLocaleDateString()}
                    </div>
                </div>
                <div className="grid grid-cols-3  w-10/12">
                    <div className="flex flex-col items-center gap-2 text-3xs font-semibold text-nowrap">
                        <img className="size-[40px]" src={game.homeTeamImage ? game.homeTeamImage : "http://placehold.co/40x40"}></img>
                        {game.homeTeam}
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center text-lg font-semibold">
                        <h3>
                            {game.homeResult}
                        </h3>
                        -
                        <h3>
                            {game.awayResult}
                        </h3>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-3xs font-semibold text-nowrap">
                        <img className="size-[40px]" src={game.awayTeamImage ? game.awayTeamImage : "http://placehold.co/40x40"}></img>
                        {game.awayTeam}
                    </div>
                </div>


                <button className="bg-orange-500 hover:bg-orange-400 text-white text-sm p-2 rounded">
                    Score game
                </button>
            </div>)}
            {toDoGames.data && toDoGames.data.length == 0 && <div className="text-lg">No games to do!</div>}
        </div>
    </div>)
}