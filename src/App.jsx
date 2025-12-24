import Hero from "./Components/Hero";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-liner-to-br from-sky-50 via-white to-emerald-50">
      
      {/* Soft animated blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-200/60 blur-3xl animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <NavBar/>
      <Hero/>
    </div>
  );
}

export default App;
