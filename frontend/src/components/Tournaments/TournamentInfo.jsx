import { BiBaseball } from "react-icons/bi"
import { RiMedalLine, RiTeamLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Outlet, Link } from "react-router-dom"
import { useState } from "react";
import { IoReorderThree } from "react-icons/io5";
export default function TournamentInfo() {
    const tournament = {
        "id": 1,
        "name": "Bulgarian Cup",
        "start_date": "2024-01-01",
        "end_date": "2024-01-10",
        "place": "Bulgaria"
    }
    const [isShrinked, setIsShrinked] = useState(false);
    return (
        <div className="w-full h-full flex flex-row gap-4 p-10">
            {!isShrinked &&
                <div className="w-1/4 items-center flex flex-col gap-4 bg-white drop-shadow-lg p-2 h-fit">
                    <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                        <IoReorderThree size={20} />
                    </button>
                    <div className="w-full flex flex-col items-center gap-4">
                        <img src="https://placehold.co/150x150"></img>
                        <h3 className="text-xl font-semibold">{tournament.name}</h3>
                    </div>
                    <div className="text-sm text-gray-500 font-semibold flex flex-col items-center">
                        <div>
                            {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                        </div>
                        <div>
                            {tournament.place}
                        </div>
                    </div>
                    <div className="flex flex-col w-full">

                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5  items-center" to={"games"}><div><BiBaseball size={30} /></div><div>Games</div></Link>
                        <hr className="border-t-[2px]"></hr>
                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"teams"}><div><RiTeamLine size={30} /></div><div>Teams</div></Link>
                        <hr className="border-t-[2px]"></hr>
                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"leaderboard"}><div><MdOutlineLeaderboard size={30} /></div><div>Leaderboard</div></Link>
                        <hr className="border-t-[2px]"></hr>
                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"ranking"}><div><RiMedalLine size={30} /></div><div>Ranking</div></Link>
                    </div>
                </div>
            }
            {isShrinked && <div className="relative size-11 ">
                <div className="fixed size-11 bg-white drop-shadow-lg p-2">
                    <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                        <IoReorderThree size={20} />
                    </button>
                </div>
            </div>}
            <div className="flex flex-row gap-4 flex-1">
                <div className="bg-line w-[2px]"></div>
                <Outlet />
            </div>
        </div>)

}