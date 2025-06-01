import { Card, CardBody, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProfileAxios from "../utils/Db/getMyProfile";
import Stars from "./Stars";


export default function ProfileCard() {
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState(null);
  const [rating,setRating] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await ProfileAxios();
        setRating(res.data.user.userStars);
        setUser(res.data.user);
        setImage(res.data.user.profilePic);
        setName(res.data.user.name);
        setLicense(res.data.user.dLNo);
        setPhone(res.data.user.phoneno);
        setEmail(res.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <Card  size="md" className="bg-black font-mono h-1/3  w-1/4 text-text shadow-xl shadow-blue-400">
      <CardBody className="flex flex-col items-start gap-4">
        <User
          name={name}
          className="text-xl font-bold"
          description={email}
          avatarProps={{
            src: image,
            size: "lg",
          }}
        />
        <p>Phone No. {phone}</p>
        <p>Licence No : {license}</p>
        <Stars rating={rating} max={5} />
      </CardBody>
    </Card>
  );
}
