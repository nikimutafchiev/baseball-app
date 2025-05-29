import { useState } from "react";
import { IoReorderThree } from "react-icons/io5";
import { MdCheck, } from 'react-icons/md';
import { RiStarLine } from "react-icons/ri";
import { Link, Outlet } from "react-router-dom";
import { MdOutlineInfo, MdOutlineAssignment } from "react-icons/md";
import { useAuth } from "../../AuthContext";
export default function Profile() {
    const { user } = useAuth();
    const [data, setData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password
    });

    const [isShrinked, setIsShrinked] = useState(false);

    return (
        <div className="h-full w-full flex flex-col md:flex-row gap-8 p-10">
            {
                !isShrinked
                &&
                <div className="relative md:w-1/3 lg:w-1/4 h-fit flex flex-col items-center gap-4 p-5 shadow-xl rounded-md bg-white">
                    <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                        <IoReorderThree size={20} />
                    </button>
                    {/* <img src="https://placehold.co/200x200" className="rounded-full border-black border-[1.5px]" /> */}
                    <div className="text-2xl font-semibold my-12">
                        {data.firstName} {data.lastName}
                    </div>
                    <div className="flex flex-col w-full">

                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5  items-center" to={"info"}><div><MdOutlineInfo size={25} /></div><div>Account info</div></Link>
                        <hr className="border-t-[2px]"></hr>
                        <Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"favorite_games"}><div><RiStarLine size={25} /></div><div>Favorite games</div></Link>
                        <hr className="border-t-[2px]"></hr>
                        {user.role === "admin" && <><Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"assignments"}><div><MdOutlineAssignment size={25} /></div><div>Assignments</div></Link>
                            <hr className="border-t-[2px]"></hr></>}
                        {user.role === "admin" && <><Link className="flex flex-row text-lg font-semibold gap-2 p-1.5 items-center" to={"to_do"}><div><MdCheck size={25} /></div><div>To do</div></Link></>}
                    </div>
                </div>
            }
            {
                isShrinked &&
                <div className=" size-11">
                    <div className="fixed p-5 size-11 shadow-xl rounded-md bg-white">
                        <button className="absolute text-black left-2 top-2 rounded-full hover:bg-gray-300 bg-gray-200 p-1" onClick={() => setIsShrinked(!isShrinked)}>
                            <IoReorderThree size={20} />
                        </button>
                    </div>
                </div>
            }
            <div className="bg-line w-[2px]"></div>
            <div className="flex flex-row gap-4 flex-1 h-full">

                <Outlet />
            </div>
        </div>)
}