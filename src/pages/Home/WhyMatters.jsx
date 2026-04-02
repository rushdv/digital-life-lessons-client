const benefits = [
  {
    title: "Document Personal Evolution",
    desc: "A digital legacy of your internal growth, allowing you to trace your path and maturity clearly.",
    icon: "📜",
    bg: "bg-indigo-50",
    text: "text-indigo-600"
  },
  {
    title: "Mindful Reflection",
    desc: "The act of writing down lessons reinforces learning and encourages a contemplative lifestyle.",
    icon: "🧘",
    bg: "bg-purple-50",
    text: "text-purple-600"
  },
  {
    title: "Collective Intelligence",
    desc: "Contribute to a pool of shared wisdom, helping others avoid mistakes and find inspiration.",
    icon: "🌍",
    bg: "bg-teal-50",
    text: "text-teal-600"
  },
  {
    title: "Never Forget Wisdom",
    desc: "Human memory is fallible, but LifeLessons is eternal. Never lose an insight that really mattered.",
    icon: "🧠",
    bg: "bg-rose-50",
    text: "text-rose-600"
  },
];

const WhyMatters = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 dark:bg-indigo-950 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-16 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-4">Core Philosophy</span>
          <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-tight">Why Learning From Life Matters ✨</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-4 text-lg">Wisdom is not what we know, but what we resolve to live. Documenting that transition is the key to mastery.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition duration-500 transform hover:-translate-y-2 group">
              <div className={`w-16 h-16 rounded-[1.5rem] ${b.bg} flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition duration-500`}>
                {b.icon}
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-4 leading-tight">{b.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMatters;