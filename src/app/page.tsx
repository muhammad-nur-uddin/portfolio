import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { WhackAMole } from "@/components/sections/whack-a-mole";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <WhackAMole />
      <Contact />
    </main>
  );
}