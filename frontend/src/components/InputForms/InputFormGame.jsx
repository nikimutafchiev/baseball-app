import { TextField } from "@mui/material"
import { RiCloseCircleLine } from "react-icons/ri"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useState, useEffect } from "react"
import { Autocomplete } from "@mui/material"
import dayjs from "dayjs"
import { useParams } from "react-router-dom"
import validator from "validator";
import { useAuth } from "../../AuthContext"
import { HOST } from "../../host"
export default function InputFormGame(props) {
    const { id } = useParams();
    const { token, logout } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [homeTeam, setHomeTeam] = useState({ id: -1, name: "" });
    const [awayTeam, setAwayTeam] = useState({ id: -1, name: "" });
    const [datetime, setDatetime] = useState(dayjs());
    const [venue, setVenue] = useState("");
    const [venueLink, setVenueLink] = useState("");
    const errorSubmit = homeTeam.id == -1 || awayTeam.id == -1 || venue.length == 0 || (venueLink.length != 0 && !validator.isURL(venueLink));
    const teams = props.teams ? props.teams : [{ id: -1, name: "" }];
    useEffect(() => {
        if (isSubmitted) {
            const time = new Date(datetime);

            fetch(`${HOST}/tournament_game/?tournament_id=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    startTime: {
                        year: time.getUTCFullYear(),
                        month: time.getUTCMonth() + 1,
                        day: time.getUTCDate(),
                        hour: time.getUTCHours(),
                        minutes: time.getUTCMinutes(),
                    },
                    venue: venue,
                    venueLink: venueLink
                }),
            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
            setHomeTeam({ id: -1, name: "" });
            setAwayTeam({ id: -1, name: "" });
            setVenue("");
            setVenueLink("");
            setIsSubmitted(false);
        }
    }, [isSubmitted]);
    return (<>
        <div className="top-10 absolute self-center z-20 w-7/12 p-2 px-4 bg-white rounded border-black border-[1px] drop-shadow-xl">
            <button className="absolute end-4" onClick={() => props.close()}><RiCloseCircleLine size={40} color="gray" /></button>
            <div className=" flex flex-col items-center gap-4 px-2">
                <div className="w-full grid grid-cols-1 gap-y-2 mt-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker value={datetime} onChange={(newValue) => setDatetime(newValue)} label="Start time" format="DD/MM/YYYY HH:mm" className="bg-white rounded" />
                    </LocalizationProvider>
                    <Autocomplete
                        value={homeTeam}
                        getOptionLabel={(option) => option.name}
                        getOptionDisabled={(option) => option.id === awayTeam.id}
                        onChange={(e, newValue) => {
                            setHomeTeam(newValue);
                        }}
                        options={teams}
                        renderInput={(params) => <TextField {...params} label={<div >Home team</div>} />}
                    >
                    </Autocomplete>
                    {/* <TextField label={<div >Home team</div>} value={homeTeam} onChange={(e) => { setHomeTeam(e.target.value) }} variant="outlined" /> */}
                    <Autocomplete
                        value={awayTeam}
                        getOptionLabel={(option) => option.name}
                        getOptionDisabled={(option) => option.id === homeTeam.id}
                        onChange={(e, newValue) => {
                            setAwayTeam(newValue);
                        }}
                        options={teams}
                        renderInput={(params) => <TextField {...params} label={<div >Away team</div>} />}
                    >
                    </Autocomplete>
                    <TextField
                        label={<div>Venue</div>}
                        onChange={(e) => { setVenue(e.target.value); }}
                        value={venue}
                    />
                    <TextField
                        label={<div>Venue link</div>}
                        onChange={(e) => { setVenueLink(e.target.value); }}
                        value={venueLink}
                        helperText={venueLink.length != 0 && !validator.isURL(venueLink) ? "Not valid link" : ""}
                    />
                </div>
                <button className={`bg-primary_2 w-1/2 self-center px-2 py-1 align-middle  text-lg font-semibold rounded ${errorSubmit ? "cursor-not-allowed bg-primary_1 text-gray-400" : "hover:bg-primary_3 text-white"}`} onClick={() => {
                    if (!errorSubmit)
                        setIsSubmitted(true);
                }}>Submit</button>
            </div>
        </div>
    </>)
}