import HeroBanner from "./HeroBanner";
import FeaturedLessons from "./FeaturedLessons";
import WhyMatters from "./WhyMatters";
import TopContributors from "./TopContributors";
import MostSaved from "./MostSaved";

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <FeaturedLessons />
      <WhyMatters />
      <TopContributors />
      <MostSaved />
    </div>
  );
};

export default Home;