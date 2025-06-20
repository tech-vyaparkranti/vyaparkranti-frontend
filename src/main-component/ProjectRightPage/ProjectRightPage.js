import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import ProjectPageSection from '../../components/ProjectPageSection/ProjectPageSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Subscribe from '../../components/Subscribe/Subscribe';

const ProjectLeftPage = (props) => {

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Projects Right Sidebar'} pagesub={'Projects'} />
            <ProjectPageSection blLeft={'order-2'}/>
            <Subscribe />
            <Footer/>
            <Scrollbar />
        </Fragment>
    )
};
export default ProjectLeftPage;
