import { Box } from "@mui/material";
import Navbar from "../components/landingPage/Navbar";
import Hero from "../components/landingPage/Hero";
import Benefits from "../components/landingPage/Benefits";
import Pricing from "../components/landingPage/Pricing";
import Results from "../components/landingPage/Results";
import Testimonials from "../components/landingPage/Testimonials";
import Contact from "../components/landingPage/Contact";
import Footer from "../components/landingPage/Footer";

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Benefits />
      <Pricing />
      <Results />
      <Testimonials />
      <Contact />
      <Footer />
    </Box>
  );
}
