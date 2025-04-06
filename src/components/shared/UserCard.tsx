
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const UserCard = ({ datas }: { datas: any }) => {
  console.log(datas);

  return (
    <div className="flex flex-col items-center justify-center p-2 user-card w-full">
      <Link to={`/profile/${datas.$id}`}>
      <img
        src={datas.imageUrl || "https://via.placeholder.com/56"}
        className="rounded-full w-14 h-14"
        alt="User Avatar"
      />
      <h2 className="mt-2 body-bold text-center">{datas.name}</h2>
     
      <Button className="shad-button_primary px-4 mt-2">info</Button>
      </Link>
    </div>
  );
};

export default UserCard;
