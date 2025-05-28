import { BiBaseball } from "react-icons/bi"
import { RiMedalLine, RiTeamLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Outlet, Link, useParams } from "react-router-dom"
import { useState } from "react";
import { IoReorderThree } from "react-icons/io5";
import useSWR from "swr";
import { HOST } from "../../host";
export default function TournamentInfo() {
    const { id } = useParams();
    const tournament = useSWR(`${HOST}/tournament/${id}`, (url) => fetch(url).then((res) => res.json()));
    const [isShrinked, setIsShrinked] = useState(false);
    return (<>
        {
            tournament.data &&
            <div className="w-full h-full flex md:flex-row flex-col gap-4 p-10">
                {!isShrinked &&
                    <div className="md:w-1/4 w-full items-center flex flex-col gap-4 bg-white drop-shadow-lg p-2 h-fit">
                        <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                            <IoReorderThree size={20} />
                        </button>
                        <div className="w-full flex flex-col items-center gap-4">
                            <img className="size-[150px]" src={tournament.data.image ? tournament.data.image : "https://placehold.co/150x150"}></img>
                            <h3 className="text-xl font-semibold">{tournament.data.name}</h3>
                        </div>
                        <div className="text-sm text-gray-500 font-semibold flex flex-col items-center">
                            <div>
                                {new Date(tournament.data.startDate).toLocaleDateString()} - {new Date(tournament.data.endDate).toLocaleDateString()}
                            </div>
                            <div>
                                {tournament.data.place}
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
                <div className=" flex-1">
                    <Outlet />
                </div>
            </div >
        }
    </>)

}