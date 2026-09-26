import { Link } from "react-router-dom";
import Logo from "@/common/Logo";
import { ThemeToggle } from "@/common/ThemeToggle";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 relative select-none">
      {/* Top Navbar */}
      <div className="absolute top-4 left-0 right-0 w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="w-full flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-6xl font-semibold text-primary-text mb-4 tracking-tight">
          Welcome to <span className="text-sky-600 dark:text-sky-400">UP</span>SKILL CRM
        </h1>
        <p className="text-secondary-text text-lg sm:text-xl mb-8 max-w-2xl leading-relaxed">
          Manage your operations, customers, inventory, and workflows efficiently in one unified dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            to="/login"
            className="w-full sm:w-auto min-w-[140px] px-6 py-3 rounded-xl bg-brand-gradient text-white text-sm font-semibold text-center shadow-md hover:opacity-95 transition-all active:scale-[0.98] no-underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
