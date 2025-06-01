import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";

export default function Stars({ rating = 0, max = 5 }) {;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex w-full gap-1 flex-row items-center">
      {[...Array(fullStars)].map((_, i) => {
       return <FaStar size={18} key={`full-${i}`} />;
      })}
      {halfStar && <FaStarHalfAlt size={18} />}
      {[...Array(emptyStars)].map((_, i) => {
       return <FaRegStar size={18} fill="bg-text" className="fill-blue-300" key={`full-${i}`} />;
      })}
    </div>
  );
}
