import GameList from "./GameList";

export default function TournamentGamesList() {
    const tournaments = [
        "Bulgarian Cup",
        "European Cup",
        "Malta Cup",
        "Serbian Cup",
        "Moldovian Cup",
        "Chinese Cup"
    ]
    return (
        <div className="flex flex-col px-5 py-10">
            {tournaments.map((tournament) =>
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-semibold">{tournament}</h1>
                    <GameList />
                    <button className="w-1/5 text-xl text-white font-semibold bg-accent_2 hover:bg-accent_3 p-3 self-end rounded">View tournament info</button>
                </div>
            )}
        </div>)
}