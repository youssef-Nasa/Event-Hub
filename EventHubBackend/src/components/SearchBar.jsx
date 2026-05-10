export default function SearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-slate-800 text-white p-3 rounded-xl outline-none"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-slate-800 text-white p-3 rounded-xl"
      >
        <option value="">All Categories</option>
        <option value="men's fashion">Fashion</option>
        <option value="electronics">Tech</option>
        <option value="women's fashion">Lifestyle</option>
      </select>

    </div>
  );
}