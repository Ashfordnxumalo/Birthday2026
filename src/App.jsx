import React from "react";
import { ThemeProvider } from "./lib/ThemeContext.jsx";
import Hero from "./components/Hero.jsx";
import Countdown from "./components/Countdown.jsx";
import Details from "./components/Details.jsx";
import RSVP from "./components/RSVP.jsx";
import Gallery from "./components/Gallery.jsx";
import LocationMap from "./components/LocationMap.jsx";
import Footer from "./components/Footer.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import MusicToggle from "./components/MusicToggle.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <MusicToggle />
      <main>
        <Hero />
        <Countdown />
        <Details />
        <RSVP />
        <Gallery />
        <LocationMap />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
