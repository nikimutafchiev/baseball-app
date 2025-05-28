import { useEffect, useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { useAuth } from "../../AuthContext";
import { HOST } from "../../host";
export default function TeamSelectList(props) {
  const { token, logout } = useAuth();
  const [teamSelected, setTeamSelected] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const addTeam = async () => {
    await fetch(
      `${HOST}/tournament_teams/?tournament_id=${props.tournament_id}&team_id=${selectedTeam.id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    ).then(response => { if (response.status === 401) { logout(); alert("Session expired. Please login again.") } }).catch((e) => console.error(e));;
    setTeamSelected(false);
    setSelectedTeam(null);
    props.close();
  };
  useEffect(() => {
    if (teamSelected && selectedTeam && props.adder) {
      addTeam();
    }
    if (teamSelected && selectedTeam && props.adder == false)
      props.close(selectedTeam);
  }, [teamSelected, selectedTeam]);
  return (
    <>
      <div className="fixed inset-0 z-10 bg-black bg-opacity-50">
        <div className="fixed z-20 inset-0 px-6 flex flex-col gap-10 cursor-default bg-white w-1/2 h-4/5  self-center justify-self-center rounded">
          <div>
            <button className="absolute end-4" onClick={() => props.close()}>
              <RiCloseCircleLine size={30} color="gray" />
            </button>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {props.teams.map((team) => (
              <button
                className="flex flex-row items-center  p-2 rounded  justify-between bg-gray-200 drop-shadow-sm "
                onClick={() => {
                  setTeamSelected(true);
                  setSelectedTeam(team);
                }}
              >
                <div className="flex flex-row gap-4 items-center">
                  <img
                    className="size-[60px]"
                    src={team.image ? team.image : "https://placehold.co/60x60"}
                  ></img>
                  <div className="font-semibold">{team.name}</div>
                </div>
                <div>{team.address}</div>
              </button>
            ))}
            {props.teams && props.teams.length == 0 && (
              <div className="text-xl">No teams to select!</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
