import React, { useEffect } from 'react';
import Cta from '../Cta';
import Div from '../Div';
import Hero3 from '../Hero/Hero3';
import MovingText from '../MovingText';
import Portfolio2 from '../Portfolio/Portfolio2';
import Portfolio3 from '../Portfolio/Portfolio3';
import Spacing from '../Spacing';
import { pageTitle } from '../../helper';
import Hero from '../Hero';


const pages = [
  {
    title: 'Start learning algorithm design concept of computational thinking',
    subtitle: 'Step 01',
    btnText: 'Start Learning',
    btnLink: '/material',
    imageUrl: '/images/algodesign.jpeg',
    category: 'Material',
  },
  {
    title: 'Maze solving using local search algorithms',
    subtitle: 'Step 02',
    btnText: 'Start Experimenting',
    btnLink: '/maze',
    imageUrl: '/images/maze.jpeg',
    category: 'Maze',
  },
  {
    title: 'Test your knowledge about algorithm design through quiz (COMING SOON)',
    subtitle: 'Step 03',
    btnText: 'Challenge Yourself',
    btnLink: '/coming-soon',
    imageUrl: '/images/quiz.jpeg',
    category: 'Quiz',
  },

];

export default function Home() {
  pageTitle('Home');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero3
        title="Computhink <br />Algorithm Design"
        btnLink="/maze"
        btnText={`Start Virtual Lab`}
        bgImageUrl="./images/herohome.jpeg"
      />
      <Spacing lg="150" md="80" />
      {pages.map((item, index) =>
        index % 2 === 0 ? (
          <Div key={index}>
            <Portfolio2
              title={item.title}
              subtitle={item.subtitle}
              btnText={item.btnText}
              btnLink={item.btnLink}
              imageUrl={item.imageUrl}
              category={item.category}
            />
            <Spacing lg="100" md="70" />
          </Div>
        ) : (
          <Div key={index}>
            <Portfolio3
              title={item.title}
              subtitle={item.subtitle}
              btnText={item.btnText}
              btnLink={item.btnLink}
              imageUrl={item.imageUrl}
              category={item.category}
            />
            <Spacing lg="100" md="70" />
          </Div>
        ),
      )}


      <Spacing lg="125" md="70" />
      <MovingText text="Start Computational Thinking" />
      <Spacing lg="105" md="70" />



      <Div className="container">
        <Cta
          title="Join our Community"
          btnText="Discord"
          btnLink="/coming-soon"
          bgSrc="/images/cta_bg_3.jpeg"
        />
      </Div>
    </>
  );
}
