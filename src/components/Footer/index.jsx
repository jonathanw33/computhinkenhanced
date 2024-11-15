import React from 'react';
import Div from '../Div';
import SocialWidget from '../Widget/SocialWidget';
import TextWidget from '../Widget/TextWidget';
import './footer.scss';

const copyrightLinks = [
  {
    title: 'Terms of Use',
    href: '/',
  },
  {
    title: 'Privacy Policy',
    href: '/',
  },
];

const serviceMenu = [
  {
    title: 'UI/UX design',
    href: '/service/service-details',
  },
  {
    title: 'WP development',
    href: '/service/service-details',
  },
  {
    title: 'Digital marketing',
    href: '/service/service-details',
  },
  {
    title: 'React development',
    href: '/service/service-details',
  },
];

export default function Footer({ copyrightText, logoSrc, logoAlt, text }) {
  const waveCount = 24;

  const generateWaves = () => {
    return Array.from({ length: waveCount }, (_, index) => {
      const marginTop = index;
      const height = waveCount - index;
      
      return (
        <div 
          key={index} 
          className="wave-bg-white" 
          style={{ 
            marginTop: `${marginTop}px`, 
            height: `${height}px` 
          }}
        />
      );
    });
  };

  return (
    <footer className="cs-fooer">

            


   
      <Div className="container">
        <Div className="cs-bottom_footer">
          <Div className="cs-bottom_footer_left">
            <Div className="cs-copyright">Copyright © 2024 TrukSapi Corporation.</Div>
          </Div>

        </Div>
      </Div>
      
      {/* Wave Section */}
      <div className="wave-groupy-wave">
        {generateWaves()}
      </div>
    </footer>
  );
}