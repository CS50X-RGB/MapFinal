import {
  Button,
  Card,
  CardBody,
  CardFooter,
  User,
  Tabs,
  Tab,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProfileAxios from "../utils/Db/getMyProfile";
import Stars from "./Stars";
import { useQuery } from "@tanstack/react-query";
import { getData } from "../core/apiHandler";
import { authRoutes } from "../core/apiRoutes";
import SkeletonCard from "./SkeletonCard";
import TransactionCard from "./TranscationCard";

export default function ProfileCard() {
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState();
  const [pageSuccess, setPageSuccess] = useState(1);
  const [pageCancel, setPageCancel] = useState(1);
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
  const { data: getTransactions, isFetching } = useQuery({
    queryKey: ["get-trans"],
    queryFn: async () => {
      return await getData(authRoutes.myTransactions, {});
    },
  });
  const { data: getTransactionsCancel, isFetching: isFetchingCancel } =
    useQuery({
      queryKey: ["get-trans-cancel", pageCancel],
      queryFn: async () => {
        return await getData(
          `${authRoutes.cancelTransaction}/${pageCancel}/5`,
          {}
        );
      },
    });
  const { data: getTransactionsSuccess, isFetching: isFetchingSuccess } =
    useQuery({
      queryKey: ["get-trans-success", pageSuccess],
      queryFn: async () => {
        return await getData(
          `${authRoutes.successTransaction}/${pageSuccess}/5`,
          {}
        );
      },
    });

  if (isFetching) {
    return <SkeletonCard />;
  }
  console.log(getTransactionsSuccess.data.success);
  return (
    <div className="flex flex-row w-screen gap-4 p-4">
      <Card
        size="md"
        className="bg-black font-mono h-[400px] w-1/4 text-text shadow-xl shadow-blue-400"
      >
        <CardBody className="flex flex-col items-start p-4 gap-4 text-lg">
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
          <div className="flex flex-row w-full text-sm items-center">
            <p>User Rating</p>
            <Stars rating={rating} max={5} />
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-2 justify-center w-full">
          <p>Involved in {getTransactions.data.total} Transactions</p>
          <p>{getTransactions.data.cancel_len} Cancelled Transactions</p>
          <p>{getTransactions.data.success_len} Successful Transactions</p>
          <Button className="w-3/4 bg-text text-back">Edit Profile</Button>
        </CardFooter>
      </Card>
      <Card className="overflow-hidden bg-inherit w-[90vh]">
        <Tabs
          fullWidth
          aria-label="Options"
          className="border border-blue-400"
          variant="bordered"
        >
          <Tab
            key="photos"
            title={
              <div className="flex flex-row items-center text-text bg-back space-x-2">
                <span>Successful</span>
                <Chip>{getTransactions.data.success_len}</Chip>
              </div>
            }
          >
            <div className="flex flex-col gap-4 items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4">
                {getTransactionsSuccess.data.success.map((t, index) => {
                  return <TransactionCard t={t} key={index} />;
                })}
              </div>
              <Pagination
                total={getTransactionsSuccess.data.pages}
                page={pageSuccess}
                onChange={setPageSuccess}
              />
            </div>
          </Tab>

          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <span>Cancelled</span>
                <Chip>{getTransactions.data.cancel_len}</Chip>
              </div>
            }
          >
            <div>
              <div className="grid grid-rows-2 grid-cols-2 gap-4 p-4">
                {getTransactionsCancel.data.cancelled.map((t, index) => {
                  return <TransactionCard t={t} key={index} />;
                })}
              </div>
              <Pagination
                total={2}
                page={pageCancel}
                onChange={setPageCancel}
              />
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}
