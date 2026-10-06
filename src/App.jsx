import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../config.js";
import { useTab } from "./lib/useTab.js";
import Hero from "./components/Hero.jsx";
import Countdown from "./components/Countdown.jsx";
import Details from "./components/Details.jsx";
import RSVP from "./components/RSVP.jsx";
import Gallery from "./components/Gallery.jsx";
import LocationMap from "./components/LocationMap.jsx";
import Footer from "./components/Footer.jsx";
import MusicToggle from "./components/MusicToggle.jsx";
import TabNav from "./components/TabNav.jsx";
import Programme from "./components/Programme.jsx";
import StoryWall from "./components/StoryWall.jsx";

function Invitation() {
  return (
    <>
      <Hero />
      <Countdown />
      <Details />
      <RSVP />
      <Gallery />
      <LocationMap />
    </>
  );
}

const PAGES = { invite: Invitation, programme: Programme, stories: StoryWall };

export default function App() {
  const [tab, setTab] = useTab();
  const Page = PAGES[tab];

  return (
    <>
      <MusicToggle />
      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Page />
        </motion.main>
      </AnimatePresence>
      <Footer />
      {config.showEventNightTabs && (
        <>
          <div className="h-24" aria-hidden="true" />
          <TabNav tab={tab} onChange={setTab} />
        </>
      )}
    </>
  );
}
