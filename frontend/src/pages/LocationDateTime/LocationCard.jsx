import { location } from '../../services/location-date-time';

const LocationCard = () => {
  return (
    <div className="w-full mb-8">
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 text-left backdrop-blur-sm shadow-xl hover:border-amber-500/20 transition-all duration-300">
        {/* Large screen layout splits into Header Left and Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Info Area (Spans 7 columns on large screens) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                Primary Venue
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide mt-2 mb-1">
                {location.id}
              </h2>
              <p className="text-sm text-[#999999] flex items-center gap-1.5">
                <span>📍</span> {location.address}
              </p>
            </div>

            {/* Availability Stats Inline Row */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs text-[#999999]">
                  Total Capacity:{' '}
                  <strong className="text-white font-semibold">
                    {location.totalSeats}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/5 border border-red-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="text-xs text-[#999999]">
                  Remaining Seats:{' '}
                  <strong className="text-red-400 font-semibold">0</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions Container (Spans 5 columns on large screens) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
            {/* Schedule Segment */}
            <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mb-1">
                Operating Hours
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#999999]">Mon - Sun</span>
                <span className="text-white font-semibold">
                  {location.label}
                </span>
              </div>
            </div>

            {/* Contact Segment */}
            <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mb-1">
                Direct Contact
              </span>
              <div className="text-xs flex items-center justify-between">
                <span className="text-[#999999]">Phone Support</span>
                <a
                  href={`tel:${location.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-white font-semibold hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  📞 {location.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
