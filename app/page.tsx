import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
