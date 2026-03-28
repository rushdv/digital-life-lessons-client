import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Preserve Your Wisdom",
    subtitle: "Don't let valuable life lessons fade away. Document and revisit them anytime.",
    bg: "from-indigo-600 to-purple-700",
    emoji: "🧠",
  },
  {
    title: "Learn From Others",
    subtitle: "Browse thousands of real-life insights shared by people just like you.",
    bg: "from-teal-500 to-cyan-700",
    emoji: "🌍",
  },
  {
    title: "Grow Every Day",
    subtitle: "Track your reflections and measure how far you've come on your journey.",
    bg: "from-rose-500 to-pink-700",
    emoji: "🌱",
  },
];

const HeroBanner = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className={`bg-gradient-to-r ${slide.bg} text-white min-h-[520px] flex items-center`}>
            <div className="max-w-4xl mx-auto px-6 text-center py-20">
              <div className="text-7xl mb-6">{slide.emoji}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
                {slide.subtitle}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/public-lessons"
                  className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full hover:shadow-lg transition"
                >
                  Explore Lessons
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroBanner;