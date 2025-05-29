import { MdClose, MdCheck } from "react-icons/md"
import useSWR from "swr";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function ProfileGameAssignments() {
    const { user, token, logout } = useAuth();
    const assignedGames = useSWR(`${HOST}/game/assigned_games/?user_id=${user.id}`, (url) => fetch(url).then((res) => res.json()));
    return (<div className="w-full flex flex-col">
        <h2 className="text-2xl font-semibold">Scoresheet assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
            {assignedGames.data && assignedGames.data.map((game) => <div className=" h-[260px] flex flex-col justify-around py-2 rounded items-center text-gray-500 bg-white  font-semibold drop-shadow-md">
                <div className="text-sm">
                    Assigned by: {game.assigner}
                </div>
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

                <div className="flex flex-row justify-around w-3/4 text-sm">
                    <button className="p-2 bg-accent_2 hover:bg-accent_3 flex flex-row items-center rounded text-white" onClick={() => {
                        fetch(`${HOST}/game/assign/?username=${user.username}&game_id=${game.id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                        alert("Succefully rejected assignment")
                        assignedGames.mutate();
                    }}>
                        <MdClose size={20} />  Reject
                    </button>
                    <button className="p-2 bg-primary_2 hover:bg-primary_3 flex flex-row items-center rounded  text-white" onClick={() => {
                        fetch(`${HOST}/game/to_do/?user_id=${user.id}&game_id=${game.id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },

                        }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
                        alert("Succefully accepted assignment")
                        assignedGames.mutate();
                    }}>
                        <MdCheck size={20} />  Accept
                    </button>

                </div>
            </div>)}
            {assignedGames.data && assignedGames.data.length == 0 && <div className="text-lg">No assigned games!</div>}
        </div>
    </div>)
}