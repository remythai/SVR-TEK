import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Banner from "@/components/Banner";
import About from "@/components/About";
import Team from "@/components/Team";
import Trusted from "@/components/Trusted";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <Projects />
      <About />
      <Banner />
      <Team />
      <Trusted />
      <Contact />
    </div>
  );
}
