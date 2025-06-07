import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Skeleton,
} from "@nextui-org/react";

export default function SkeletonCard({ isLoaded }) {
  return (
    <Card
      size="md"
      className="bg-black font-mono h-1/3 w-1/4 text-text shadow-xl shadow-blue-400"
    >
      <CardBody className="flex flex-col items-start p-4 gap-4 text-lg">
        {/* Avatar + Name + Email */}
        <div className="flex items-center gap-4 w-full">
          <Skeleton isLoaded={isLoaded} className="rounded-full h-12 w-12">
            <div className="h-12 w-12 rounded-full bg-text" />
          </Skeleton>
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton isLoaded={isLoaded} className="h-4 w-3/4 rounded-lg">
              <div className="h-4 w-3/4 bg-text rounded-lg" />
            </Skeleton>
            <Skeleton isLoaded={isLoaded} className="h-3 w-1/2 rounded-lg">
              <div className="h-3 w-1/2  rounded-lg" />
            </Skeleton>
          </div>
        </div>

        {/* Phone number */}
        <Skeleton isLoaded={isLoaded} className="h-4 w-2/3 rounded-lg">
          <div className="h-4 w-2/3 bg-text rounded-lg" />
        </Skeleton>

        {/* License number */}
        <Skeleton isLoaded={isLoaded} className="h-4 w-3/4 rounded-lg">
          <div className="h-4 w-3/4 bg-text rounded-lg" />
        </Skeleton>

        {/* Rating */}
        <div className="flex items-center gap-4 w-full text-sm">
          <Skeleton isLoaded={isLoaded} className="h-4 w-1/4 rounded-lg">
            <div className="h-4 w-1/4 bg-text rounded-lg" />
          </Skeleton>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} isLoaded={isLoaded} className="h-4 w-4 rounded">
                <div className="h-4 w-4 bg-secondary-100 rounded" />
              </Skeleton>
            ))}
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex flex-row items-center justify-center w-full">
        <Skeleton isLoaded={isLoaded} className="w-3/4 h-10 rounded-lg">
          <Button className="w-3/4 bg-text text-back">Edit Profile</Button>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}
