import Hero from '../src/components/Hero/Hero'
import Impact from '../src/components/Impact/impact'
import Sealink from '../src/components/Sealink/Sealink'
import ResponsiveImage from '../src/components/ResponsiveImage/ResponsiveImage'
import ContactUs from '../src/components/ContactUs/ContactUs'
import { ParallaxWrapper } from '../src/components/ParallaxWrapper'

export default function Home() {
  return (
    <div className="scrollable-container">
      
      <Hero />
      
      <ParallaxWrapper>
        <Impact />
      </ParallaxWrapper>

      <ParallaxWrapper offset={30}>
        <Sealink/>
      </ParallaxWrapper>

      <ParallaxWrapper offset={40}>
        <ResponsiveImage/>
      </ParallaxWrapper>

      <ParallaxWrapper offset={60}>
        <ContactUs />
      </ParallaxWrapper>
    </div>
  );
}