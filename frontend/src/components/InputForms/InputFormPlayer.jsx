import { useEffect, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import { TextField, InputAdornment, InputLabel, Autocomplete } from "@mui/material";
import { RiCloseCircleLine } from "react-icons/ri";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import convertToBase64 from "../../global/ImageToBase64"
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";

export default function InputFormPlayer(props) {
    const { token, logout } = useAuth();
    const [firstName, setFirstName] = useState(props.isEdit ? props.player.firstName : "");
    const [lastName, setLastName] = useState(props.isEdit ? props.player.lastName : "");
    const [date, setDate] = useState(props.isEdit ? dayjs(props.player.dateOfBirth) : dayjs());
    const [height, setHeight] = useState(props.isEdit ? props.player.height : "");
    const [weigth, setWeigth] = useState(props.isEdit ? props.player.weigth : "");
    const [throwingArm, setThrowingArm] = useState(props.isEdit ? props.player.throwingArm : null);
    const [battingSide, setBattingSide] = useState(props.isEdit ? props.player.battingSide : null);
    const [gender, setGender] = useState(props.isEdit ? props.player.gender : null);
    const [country, setCountry] = useState(props.isEdit ? props.player.country : "");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const arms = [{
        value: "LEFTY",
        label: "Left"
    },
    {
        value: "RIGHTY",
        label: "Right"
    },
    {
        value: "AMBIDEXTROUS",
        label: "Both"
    }
    ];

    const genders = [
        { value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }
    ]
    const country_list = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
        "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
        "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
        "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada",
        "Central African Republic", "Chad", "Chile", "China",
        "Colombia", "Comoros", "Congo", "Costa Rica",
        "Croatia", "Cuba", "Cyprus", "Czechia",
        "Democratic Republic of the Congo", "Denmark", "Djibouti",
        "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
        "Eswatini", "Ethiopia", "Fiji", "Finland",
        "France", "Gabon", "Gambia", "Georgia", "Germany",
        "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
        "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras",
        "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
        "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
        "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
        "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
        "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
        "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
        "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
        "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
        "Oman", "Pakistan", "Palau", "Palestine State", "Panama",
        "Papua New Guinea", "Paraguay", "Peru", "Philippines",
        "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
        "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Korea", "South Sudan", "Spain",
        "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
        "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
        "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
        "United Arab Emirates", "United Kingdom", "United States of America",
        "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
        "Yemen", "Zambia", "Zimbabwe"
    ];
    useEffect((() => {
        if (isSubmitted) {
            const dateOfBirth = new Date(date);
            fetch(`${HOST}/player${props.isEdit ? "/" + props.player.id.toString() : ""}`, {
                method: (props.isEdit ? "PATCH" : "POST"),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: {
                        day: dateOfBirth.getDate(),
                        month: dateOfBirth.getMonth() + 1,
                        year: dateOfBirth.getFullYear()
                    },
                    height: height,
                    weigth: weigth,
                    throwingArm: throwingArm,
                    battingSide: battingSide,
                    gender: gender,
                    country: country,
                    image: image
                }),
            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));
            if (props.isEdit)
                props.close();
            setFirstName("");
            setLastName("");
            setDate(dayjs());
            setHeight("");
            setWeigth("");
            setThrowingArm(null);
            setBattingSide(null);
            setGender(null);
            setCountry("");
            setImage(null);
            setImageURL("http://placehold.co/150x200")
            setIsSubmitted(false);
        }
    }), [isSubmitted]);
    const [errorWeigth, setErrorWeigth] = useState(false);
    const [errorHeight, setErrorHeigth] = useState(false);
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("http://placehold.co/150x200")
    const errorSubmit = errorHeight || errorWeigth || firstName === "" || lastName === "" || date.year() >= dayjs().year() - 1 || date.year() <= 1920;
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return (
        <div className=" top-2 md:top-6 fixed self-center z-20 w-11/12 md:w-8/12   bg-white rounded border-black border-[1px] drop-shadow-xl">
            <button className="absolute end-4" onClick={() => props.close()}><RiCloseCircleLine size={40} color="gray" /></button>
            <div className="w-full flex flex-col py-10 px-4">
                <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-10 md:gap-20 py-10 px-4">
                    <div className='flex flex-col min-w-[150px] self-center gap-4 items-center justify-center'>
                        <img src={imageURL} className='w-[150px] h-[200px] bg-gray-300 rounded'></img>
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
                                setImageURL("http://placehold.co/150x200")
                            }
                        }} ></input>
                    </div>
                    <div className="py-2 flex flex-col  gap-4">
                        <div className="flex flex-row gap-2">
                            <TextField disabled={props.isEdit} label={<div className="text-sm">First name*</div>} variant="outlined" className="w-1/2" onChange={(e) => { const newValue = e.target.value; if (/^[a-zA-Z]*$/.test(newValue.charAt(newValue.length - 1))) setFirstName(e.target.value) }} value={firstName} size="small"></TextField>
                            <TextField disabled={props.isEdit} label={<div className="text-sm">Last name*</div>} variant="outlined" className="w-1/2" onChange={(e) => { const newValue = e.target.value; if (/^[a-zA-Z]*$/.test(newValue.charAt(newValue.length - 1))) setLastName(e.target.value) }} value={lastName} size="small"></TextField>
                        </div>


                        <div className=" w-4/5 flex flex-col gap-1 ">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker disabled={props.isEdit} value={date} shouldDisableYear={(date) => {
                                    const currentYear = dayjs().year();
                                    return date.year() >= currentYear - 1;
                                }} onChange={(newValue) => setDate(newValue)} format="DD/MM/YYYY" label="Date of birth" className="bg-white rounded" />
                            </LocalizationProvider>
                        </div>
                        <Autocomplete
                            size="small"
                            className="w-3/5"
                            value={country}
                            onChange={(e, newValue) => {
                                setCountry(newValue);
                            }}
                            options={country_list}
                            renderInput={(params) => <TextField {...params} label={<div className="text-sm">Country</div>} />}
                        >
                        </Autocomplete>
                        <div className="gap-6 grid grid-cols-2 md:grid-cols-3">

                            <TextField
                                size="small"
                                select
                                label={<div className="text-sm">Gender</div>}
                                onChange={(e) => { setGender(e.target.value) }}
                                value={gender}
                            >
                                {genders.map((option) => (
                                    <MenuItem key={option.value} value={option.value} >
                                        {<div className="text-sm">{option.label}</div>}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                size="small"
                                type="number"
                                label={<div className="text-sm">Height</div>}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment >{<div className="text-sm ml-1">cm</div>}</InputAdornment>,
                                    },
                                }}
                                onChange={(e) => { setHeight(e.target.value); setErrorHeigth(e.target.value !== "" && (e.target.value < 60 || e.target.value > 250)) }}
                                value={height}
                                error={errorHeight}
                                helperText={errorHeight ? <div className="text-5xs text-nowrap w-fit">Height must be between 60 and 250 cm</div> : ""}
                            />
                            <TextField
                                size="small"
                                type="number"
                                label={<div className="text-sm">Weigth</div>}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment >{<div className="text-sm ml-1">kg</div>}</InputAdornment>,
                                    },
                                }}
                                onChange={(e) => { setWeigth(e.target.value); setErrorWeigth(e.target.value !== "" && (e.target.value < 20 || e.target.value > 250)) }}
                                value={weigth}
                                error={errorWeigth}
                                helperText={errorWeigth ? <div className="text-5xs text-nowrap w-fit">Weigth must be between 20 and 250 kg</div> : ""}
                            />

                        </div>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <TextField
                                size="small"
                                select
                                label={<div className="text-sm">Throwing arm</div>}
                                onChange={(e) => { setThrowingArm(e.target.value) }}
                                value={throwingArm}
                            >
                                {arms.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {<div className="text-sm">{option.label}</div>}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                size="small"
                                select
                                label={<div className="text-sm">Batting side</div>}
                                onChange={(e) => { setBattingSide(e.target.value) }}
                                value={battingSide}
                            >
                                {arms.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {<div className="text-sm">{option.label}</div>}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </div>
                </div>
                <button className={`bg-primary_2 w-1/2 self-center px-2 py-1 align-middle  text-lg font-semibold rounded ${errorSubmit ? "cursor-not-allowed bg-primary_1 text-gray-400" : "hover:bg-primary_3 text-white"}`} onClick={() => {
                    if (!errorSubmit)
                        setIsSubmitted(true);
                }}>{props.isEdit ? "Save" : "Submit"}</button>
            </div>


        </div>);
}