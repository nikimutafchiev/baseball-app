import Team from "./Team"
import { CircularProgress, Alert } from "@mui/material"
export default function TeamList(props) {

    return (<>
        {props.teams.isLoading && <div className="flex flex-row justify-center w-full "><CircularProgress color='success' size={60} /></div>}
        {(props.teams.error && !props.teams.isLoading) && <Alert className="flex flex-row justify-center w-1/2 mx-auto" severity="error">Error occured, while fetching teams!</Alert>}
        {props.teams.data && props.teams.data.length != 0 && <div className={` grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12`} >
            {props.teams.data.filter((team) => team.name.toLowerCase().includes(props.searchInput.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)).map((team) => <Team {...team} />)}
        </div>}
        {props.teams.data && props.teams.data.length == 0 && <div className="text-3xl ">Oops, no data here yet!</div>}
    </>)
}