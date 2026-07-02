import AiTools from "../components/AiTools";
import DummyImages from "../components/DummyImages";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Plan from "../components/Plan";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonials />
      <DummyImages />
      <Plan />
      <Footer />
    </>
  );
};

export default Home;
