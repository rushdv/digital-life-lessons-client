const cards = [
  { emoji: "🧘", title: "Mindful Reflection", desc: "Journaling life lessons encourages daily mindfulness and thoughtful self-awareness." },
  { emoji: "📈", title: "Personal Growth", desc: "Track your progress over time and see how much you've evolved as a person." },
  { emoji: "🤝", title: "Community Wisdom", desc: "Learn from others' experiences and avoid repeating common mistakes." },
  { emoji: "🔒", title: "Private & Secure", desc: "Keep lessons private or share publicly — you're always in control." },
];

const WhyMatters = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">💡 Why Learning From Life Matters</h2>
        <p className="text-gray-500 mt-2">Four reasons to start documenting your journey today</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">{c.emoji}</div>
            <h3 className="text-base font-bold text-gray-800 mb-2">{c.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyMatters;