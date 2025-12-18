export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title or location..."
      className="w-full md:w-96 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 
                 text-black dark:text-white border border-slate-300 dark:border-slate-700
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
