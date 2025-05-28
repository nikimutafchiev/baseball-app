import { TextField } from "@mui/material";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaFacebook, FaInstagram, FaLink, FaYoutube } from "react-icons/fa";
import { useState, useEffect } from "react";
import validator from "validator";
import convertToBase64 from "../../global/ImageToBase64";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function InputFormTeam(props) {
    const icons = {
        facebook: <FaFacebook size={30} />,
        instagram: <FaInstagram size={30} />,
        youtube: <FaYoutube size={30} />,
        website: <FaLink size={30} />

    }
    const [links, setLinks] = useState({
        facebook: "",
        instagram: "",
        youtube: "",
        website: ""

    })
    const [mediaOption, setMediaOption] = useState("facebook");
    const [name, setName] = useState("");
    const [tlc, setTLC] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [manager, setManager] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("http://placehold.co/200x200")
    const [headCoach, setHeadCoach] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const errorSubmit = name === "" || tlc.length != 3 || Object.entries(links).map(([media, url]) => { return !validator.isURL(url) && url.length != 0 }).includes(true);
    const { token, logout } = useAuth();
    useEffect((() => {
        if (isSubmitted) {
            fetch(`${HOST}/team`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    tlc: tlc,
                    address: address,
                    contact: contact,
                    socialMedia: links,
                    manager: manager,
                    headCoach: headCoach,
                    image: image
                }),
            }).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
            setName("");
            setTLC("");
            setAddress("");
            setContact("");
            setManager("");
            setHeadCoach("");
            setLinks({
                facebook: "",
                instagram: "",
                youtube: "",
                website: ""
            });
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
                        <div className="flex flex-row gap-4">
                            <TextField className="w-3/5" label={<div >Name*</div>} variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField className="w-2/5" label={<div >Three letter code*</div>} variant="outlined" helperText={"Example: BUL"} value={tlc} onChange={(e) => { const newValue = e.target.value; if (/^[a-zA-Z]*$/.test(newValue.charAt(newValue.length - 1))) setTLC(newValue.toUpperCase()) }} slotProps={{
                                input: {
                                    inputProps: {
                                        maxLength: 3
                                    }
                                }
                            }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField label={<div >Address</div>} onChange={(e) => { setAddress(e.target.value) }} value={address} variant="outlined" />
                            <TextField label={<div >Contact</div>} onChange={(e) => { setContact(e.target.value) }} value={contact} variant="outlined" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField label={<div >Manager</div>} onChange={(e) => { setManager(e.target.value) }} value={manager} variant="outlined" />
                            <TextField label={<div >Head Coach</div>} onChange={(e) => { setHeadCoach(e.target.value) }} value={headCoach} variant="outlined" />
                        </div>
                        <div className="flex flex-row gap-8 self-center text-gray-700">
                            {Object.entries(icons).map(([media, icon]) => <div className="cursor-pointer" onClick={() => setMediaOption(media)}>{icon}</div>)}
                        </div>
                        <TextField label={<div>{mediaOption.charAt().toUpperCase() + mediaOption.slice(1)} link</div>} variant="outlined" value={links[mediaOption]} helperText={!validator.isURL(links[mediaOption]) && links[mediaOption].length != 0 ? "This is not valid link" : ""} onChange={(e) => { setLinks({ ...links, [mediaOption]: e.target.value }) }} />
                    </div>
                </div>
                <button className={`bg-primary_2  px-2 py-1 w-2/3  text-lg font-semibold rounded ${errorSubmit ? "cursor-not-allowed bg-primary_1 text-gray-400" : "hover:bg-primary_3 text-white"}`} onClick={() => {
                    if (!errorSubmit)
                        setIsSubmitted(true);
                }
                }>Submit</button>
            </div>
        </div >);
}