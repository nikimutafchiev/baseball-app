import { RiLiveLine, RiCalendarScheduleLine, RiCheckDoubleLine, RiArrowRightCircleLine, RiStarLine, RiStarFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '../../AuthContext';
import { HOST } from '../../host';
export default function Game(props) {
    const { user, token, logout } = useAuth();
    const statusIcons = {
        live: <RiLiveLine size={props.size == "small" ? 20 : 25} />,
        scheduled: <RiCalendarScheduleLine size={props.size == "small" ? 20 : 25} />,
        ended: <RiCheckDoubleLine size={props.size == "small" ? 20 : 25} />
    };

    const favorite = useSWR(`${HOST}/game/liked/?user_id=${user ? user.id : -1}&game_id=${props.id}`, (url) => fetch(url).then((res) => res.json()));
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
        if (favorite.data)
            setIsLiked(favorite.data.isLiked)
    }, [favorite.data]);
    return (
        <div className="w-full grid md:grid-cols-11 grid-cols-1 gap-2 justify-around min-h-[60px] px-8 py-2 rounded place-items-center text-gray-500 bg-white  font-semibold  drop-shadow-xl">
            {user && <button className='text-yellow-500' onClick={() => {
                fetch(`${HOST}/game/like/?user_id=${user.id}&game_id=${props.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));
                setIsLiked(!isLiked);
            }}>{!isLiked && <RiStarLine size={30} />}{isLiked && <RiStarFill size={30} />}</button>}
            <div className="md:col-span-2 flex flex-col gap-2 items-center"><div className={`flex flex-row gap-2 items-center ${props.size == "normal" ? "text-normal" : "text-xs"}`}>{statusIcons[props.status]}{props.status}</div><div className=" font-semibold text-2xs" >{new Date(props.startTime).toLocaleString()}</div></div>
            <div className={`grid grid-cols-5  justify-around items-center  ${user && user.role == "admin" ? "md:col-span-5" : "md:col-span-7"} w-full`}>
                <div className={`col-span-2 ${props.size == "normal" ? "text-xs" : "text-2xs"} flex flex-row gap-4 items-center`}><img className="size-[40px]" src={props.homeTeamImage ? props.homeTeamImage : "https://placehold.co/40x40"}></img><div className='w-1/2 text-center'>{props.homeTeam}</div></div>
                <div className={`${props.size == "normal" ? "md:text-xl text-sm" : "text-lg"} text-center font-bold `}>{props.homeResult} - {props.awayResult}</div>
                <div className={`col-span-2 ${props.size == "normal" ? "text-xs" : "text-2xs"} flex flex-row gap-4 items-center`}><div className='w-1/2 text-center'>{props.awayTeam}</div><img className="size-[40px]" src={props.awayTeamImage ? props.awayTeamImage : "https://placehold.co/40x40"}></img></div>
            </div>
            <Link className={`w-2/5 md:w-full ${props.size == "normal" ? "text-xs" : "text-2xs"} ${user ? "" : "md:col-span-2"} py-2 rounded bg-blue-500 hover:bg-blue-400 text-white  ease-in-out text-center duration-150`} to={`/games/${props.id}`}>More Info</Link>
            <Link to={props.status === "scheduled" ? `/score/${props.id}/roster` : `/score/${props.id}`} className={`w-2/5  px-1 py-2 bg-orange-400 rounded text-white text-nowrap ${props.size == "normal" ? "text-xs" : "text-2xs"} hover:bg-orange-300 flex flex-row items-center gap-1 justify-center ${user && user.role == "admin" ? "md:w-full md:col-span-2" : "hidden "}`}><div>Score game</div><RiArrowRightCircleLine size={15} /></Link>
        </div>
    )
}