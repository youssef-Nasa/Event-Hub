import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="bg-slate-800 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300 shadow-lg"
    >
      <div className="relative">
        <img
          src={event.imageCover}
          className="w-full h-48 object-cover"
        />
        {event.status === "Sold Out" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-4 py-2 bg-rose-600 text-white font-black uppercase tracking-tighter rounded-lg transform -rotate-12 border-2 border-white shadow-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-white font-bold text-lg mb-2">
          {event.title}
        </h2>

        <p className="text-slate-400 text-sm">
          {event.category.name}
        </p>

        <div className="flex justify-between mt-3 text-sm">
          <span className="text-purple-400 font-bold">
            {event.price} EGP
          </span>

          <span className="text-yellow-400">
            ⭐ {event.ratingsAverage}
          </span>
        </div>
      </div>
    </div>
  );
}