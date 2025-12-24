export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl lg:px-0 px-2">
        <div className="flex items-center justify-center gap-3 rounded-b-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3">
          
          <img
            src="/medstore_logo.png"
            alt="MedIndia Store"
            className="h-8 w-8 object-contain"
          />

          <h1 className="text-2xl font-logo text-emerald-700">
            MedIndia <span className="text-emerald-500">Store</span>
          </h1>

        </div>
      </div>
    </nav>
  );
}
