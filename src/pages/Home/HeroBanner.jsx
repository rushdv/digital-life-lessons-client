import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Preserve Your Wisdom",
    subtitle: "Don't let valuable life lessons fade away. Document and revisit them anytime to continue your internal evolution.",
    bg: "from-[#1e1b4b] to-[#4338ca]",
    emoji: "🧠",
    accent: "text-indigo-400"
  },
  {
    title: "Learn From Others",
    subtitle: "Browse thousands of real-life insights shared by people just like you. Collective intelligence is the key to progress.",
    bg: "from-[#064e3b] to-[#0d9488]",
    emoji: "🌍",
    accent: "text-teal-400"
  },
  {
    title: "Grow Every Day",
    subtitle: "Track your reflections and measure how far you've come. A life unexamined is a missed opportunity for growth.",
    bg: "from-[#881337] to-[#e11d48]",
    emoji: "🌱",
    accent: "text-rose-400"
  },
];

const HeroBanner = () => {
  return (
    <div className="relative group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        loop
        className="w-full h-[600px] md:h-[700px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className={`bg-gradient-to-br ${slide.bg} text-white h-full flex items-center relative overflow-hidden`}>
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-[0.03] skew-x-[-20deg] translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left transition-all duration-1000 animate-fade-in-up">
                  <span className={`inline-block mb-6 text-sm font-black uppercase tracking-[0.3em] ${slide.accent}`}>The Sage Archive</span>
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter italic">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl leading-relaxed font-medium">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                    <Link
                      to="/public-lessons"
                      className="bg-white text-gray-900 font-black px-10 py-4 rounded-2xl hover:scale-105 transform transition shadow-2xl uppercase text-xs tracking-widest"
                    >
                      Explore Lessons
                    </Link>
                    <Link
                      to="/register"
                      className="backdrop-blur-md bg-white/10 text-white font-black px-10 py-4 rounded-2xl hover:bg-white/20 transition border border-white/20 uppercase text-xs tracking-widest shadow-xl"
                    >
                      Get Started Free
                    </Link>
                  </div>
                </div>

                <div className="w-1/3 hidden lg:flex justify-center transition-all duration-1000 animate-pulse-slow">
                   <div className="text-[12rem] filter drop-shadow-2xl">{slide.emoji}</div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;