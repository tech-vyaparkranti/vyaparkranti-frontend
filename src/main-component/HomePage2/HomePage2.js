import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2'
import Hero2 from '../../components/hero2';
import ServiceSectionS2 from '../../components/ServiceSectionS2/ServiceSectionS2';
import SeoSection from '../../components/SeoSection/SeoSection';
import CtaSectionS2 from '../../components/CtaSectionS2/CtaSectionS2';
import ProjectSection from '../../components/ProjectSection/ProjectSection';
import WhyChoose from '../../components/WhyChoose/WhyChoose';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Testimonial2 from '../../components/Testimonial2/Testimonial2';
import FaqSection from '../../components/FaqSection/FaqSection';
import PartnerSection from '../../components/PartnerSection';
import BlogSection2 from '../../components/BlogSection2/BlogSection2';
import Footer2 from '../../components/footer2/Footer2';

const HomePage2 = () => {
    return (
        <Fragment>
            <Navbar2 />
            <Hero2 />
            <ServiceSectionS2 svClass={'style-two'}/>
            <SeoSection />
            <CtaSectionS2 />
            <PartnerSection styleClass={'clients-section-two margin-top'}/>
            <ProjectSection />
            <WhyChoose />
            <Testimonial2 />
            <FaqSection />
            <BlogSection2 sClass={'style-two'}/>
            <Footer2 />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage2;