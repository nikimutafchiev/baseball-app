import { Link } from "react-router-dom"
export default function Tournament(props) {

    return (
        <div className="bg-white drop-shadow-lg items-center rounded flex lg:flex-row  flex-col gap-6 md:gap-8 p-2">
            {!props.image && <img className="size-[100px]" src="https://placehold.co/100x100" />}
            {props.image && <img className="size-[100px]" src={props.image} />}
            <div className="text-sm font-semibold text-center text-gray-700">
                {props.place}
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
                <div className="font-semibold text-xl text-center">
                    {props.name}
                </div>
                <div className="text-sm text-center">
                    {new Date(props.startDate).toLocaleDateString()} - {new Date(props.endDate).toLocaleDateString()}
                </div>
            </div>
            <Link className="w-1/2 md:w-1/5 text-white font-semibold bg-accent_2 hover:bg-accent_3 p-2 rounded text-center" to={`/tournaments/${props.id}/games`}>View more</Link>

        </div>)
}