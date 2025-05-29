import { RiCloseCircleLine } from "react-icons/ri";
import useSWR from "swr";
import { HOST } from "../../host";
export default function RosterPlayerPicker(props) {
    const roster = useSWR(`${HOST}/tournament/team_tournament/roster/?team_id=${props.team.id}&tournament_id=${props.tournament.id}`, (url) => fetch(url).then((res) => res.json()));

    return (<div className="fixed inset-0 z-10 bg-black bg-opacity-50">
        <div className="fixed z-20 inset-0 px-6 flex flex-col text-white font-semibold cursor-default bg-white w-1/2 h-4/5  self-center justify-self-center rounded">
            <div className="h-[12%] flex flex-row items-center justify-between">
                <div>
                    <button className="bg-red-500 hover:bg-red-400 rounded p-2"
                        onClick={() => { props.clear(); props.close() }}>Clear</button>
                </div>
                <div className="font-semibold text-center text-lg text-black">
                    Select player from {props.team.name}
                </div>
                <div>
                    <button onClick={() => props.close()}><RiCloseCircleLine size={40} color="gray" /></button>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto px-2">
                {roster.data && [...roster.data]
                    .sort((player) => {
                        if (!props.takenPlayers.includes(player.id)) return -1
                        else return 0
                    }).map((player) =>
                        <button className={`${props.takenPlayers.includes(player.id) ? "bg-primary_1 text-gray-400 pointer-events-none" : "bg-primary_2 hover:bg-primary_2_hover"} flex flex-row py-2 px-4 my-2 rounded items-center gap-6 `}
                            onClick={() => { props.nextPage(); props.setter({ id: player.id, uniformNumber: player.uniformNumber, firstName: player.firstName, lastName: player.lastName }); }}>
                            <img className="size-[100px]" src={player.image ? player.image : "https://placehold.co/100x100"} />
                            <div className="flex flex-row items-center gap-6">
                                <div className="font-bold text-lg w-12">#{player.uniformNumber}</div>
                                <div className="text-2xl">{player.firstName} {player.lastName}</div>
                            </div>
                        </button>
                    )}
                {roster.data && roster.data.length == 0 && <div className="text-lg text-black font-normal mt-4">Oops, no players in this team!</div>}
            </div>
        </div >
    </div >)
}