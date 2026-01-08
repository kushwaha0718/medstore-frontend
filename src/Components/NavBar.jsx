export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl lg:px-0 px-2 ">
        <div className="flex items-center justify-center gap-3 rounded-b-2xl bg-white/30 backdrop-blur-xl border-t-0 border-2 border-green-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3">
          
          <img
            src="/medstore_logo.png"
            alt="MedIndia Store"
            className="h-8 w-8 md:h-17 md:w-17 object-contain"
          />

          <h1 className="text-2xl lg:text-5xl font-logo font-bold text-emerald-700">
            MedIndia <span className="text-emerald-500">HealthCare</span>
          </h1>

        </div>
      </div>
    </nav>
  );
}
