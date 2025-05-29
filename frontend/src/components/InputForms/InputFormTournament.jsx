import { TextField } from "@mui/material";
import { RiCloseCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import convertToBase64 from "../../global/ImageToBase64";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function InputFormTournament(props) {
    const [name, setName] = useState("");
    const [place, setPlace] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const errorSubmit = name === "";
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("http://placehold.co/200x200");
    const { token, logout } = useAuth();
    useEffect((() => {
        if (isSubmitted) {
            const start_date = new Date(startDate), end_date = new Date(endDate);
            fetch(`${HOST}/tournament/tournament`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    place: place,
                    startDate: {
                        "date": start_date.getDate(), "month": start_date.getMonth() + 1, "year": start_date.getFullYear()
                    },
                    endDate: {
                        "date": end_date.getDate(), "month": end_date.getMonth() + 1, "year": end_date.getFullYear()
                    },
                    image: image
                }),
            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
            setName("");
            setPlace("");
            setStartDate(dayjs());
            setEndDate(dayjs());
            setImage(null);
            setImageURL("http://placehold.co/200x200")
            setIsSubmitted(false);
        }
    }), [isSubmitted]);
    return (
        <div className="top-10 fixed self-center z-20 md:w-7/12 w-11/12 p-2 px-4 bg-white rounded border-black border-[1px] drop-shadow-xl">
            <button className="absolute end-4" onClick={() => props.close()}><RiCloseCircleLine size={40} color="gray" /></button>
            <div className="flex flex-col items-center gap-12 mt-12">
                <div className="flex flex-col md:flex-row w-full gap-12">
                    <div className='flex flex-col min-w-[200px] self-center items-center gap-4'>
                        <img src={imageURL} className='size-[200px] rounded'></img>
                        <label for="input-image-player" className="w-[120px] h-fit bg-blue-400 rounded p-3 text-white text-sm font-semibold text-center">Upload photo</label>
                        <input type="file" id="input-image-player" className="hidden" accept=".jpeg, .png, .jpg" onChange={async (e) => {
                            if (e.target.files.length != 0) {
                                if (e.target.files[0].size <= 131072) {
                                    const base64 = await convertToBase64(e.target.files[0]);
                                    setImage(base64);
                                    setImageURL(base64)
                                }
                                else {
                                    alert("File is too big! Max size is 128KB!");
                                }
                            }
                            else {
                                setImageURL("http://placehold.co/200x200")
                            }
                        }} ></input>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <TextField className="w-full" label={<div >Name*</div>} variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker format="DD/MM/YYYY" label="Start date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker format="DD/MM/YYYY" label="End date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                            </LocalizationProvider>
                        </div>

                        <TextField className="w-full" label={<div>Place</div>} value={place} onChange={(e) => { setPlace(e.target.value) }} variant="outlined" />

                    </div>
                </div>
                <button className={`bg-primary_2  px-2 py-1 w-2/3  text-lg font-semibold rounded ${errorSubmit ? "cursor-not-allowed bg-primary_1 text-gray-400" : "hover:bg-primary_3 text-white"}`}
                    onClick={() => {
                        if (!errorSubmit)
                            setIsSubmitted(true);
                    }}
                >Submit</button>
            </div>
        </div >);
}