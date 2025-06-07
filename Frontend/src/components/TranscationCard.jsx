import { Card, CardBody, User, Chip } from "@nextui-org/react";
import { CheckIcon } from "../Icons/CheckIcon";
import CrossIcon from "../Icons/CrossIcon";

export default function TransactionCard({ t }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="bg-text flex font-mono flex-col gap-4">
      <CardBody className="flex flex-col gap-4 p-3">
        <div className="flex flex-col items-start">
          <p className="text-sm">Needed By</p>
          <User
            name={t.orderedBy.name}
            className="text-black font-mono font-bold"
            classNames={{
              description: "text-black",
            }}
            description={t.orderedBy.email}
            avatarProps={{
              src: t.orderedBy.profilePic,
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm">Full Filled By</p>
          <User
            name={t.fullfilledBy.name}
            className="text-black font-bold font-mono"
            classNames={{
              description: "text-black",
            }}
            description={t.fullfilledBy.email}
            avatarProps={{
              src: t.fullfilledBy.profilePic,
            }}
          />
        </div>
        <Chip startContent={
          t.status.toUpperCase() === "COMPLETED" ? <CheckIcon/> : <CrossIcon className={"fill-white"}/>
        } className={t.status.toUpperCase() === "COMPLETED" ?  "bg-green-500 text-white" : "bg-red-500 text-white"}>{t.status.toUpperCase()}</Chip>
      </CardBody>
    </Card>
  );
}
