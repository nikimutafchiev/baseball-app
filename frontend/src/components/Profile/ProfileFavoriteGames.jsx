import { Link } from "react-router-dom"
import useSWR from "swr"
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function ProfileFavoriteGames() {
    const { user } = useAuth();
    const favoriteGames = useSWR(`${HOST}/liked_games/?user_id=${user.id}`, (url) => fetch(url).then((res) => res.json()));
    return (<div className="w-full flex flex-col">
        <h2 className="text-2xl font-semibold">Favorite games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-around gap-4 flex-wrap py-5">
            {favoriteGames.data && favoriteGames.data.map((game) => <div className=" h-[200px] flex flex-col justify-around py-2 rounded items-center text-gray-500 bg-white  font-semibold drop-shadow-md">
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
                        <img className='size-[40px]' src={game.homeTeamImage ? game.homeTeamImage : "https://placehold.co/40x40"}></img>
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
                        <img className="size-[40px]" src={game.awayTeamImage ? game.awayTeamImage : "https://placehold.co/40x40"}></img>
                        {game.awayTeam}
                    </div>
                </div>
                <Link className="p-2 rounded bg-blue-500 hover:bg-blue-400 text-white text-xs ease-in-out text-center duration-150" to={`/games/${game.id}`}>More Info</Link>
            </div>)}
            {favoriteGames.data && favoriteGames.data.length == 0 && <div className="text-xl">No favorite games!</div>}
        </div>
    </div>)
}