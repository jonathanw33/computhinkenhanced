import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './header.scss';
import Div from '../Div';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import StartButton from '../StartButton'; 
import Profile from '../Profile'; 
import LogoutButton from '../LogoutButton'; 

export default function Header({ variant }) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);

  const { isAuthenticated } = useAuth0();
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    });
  }, []);

  return (
    <>
      <header
        className={`cs-site_header cs-style1 text-uppercase ${
          variant ? variant : ''
        } cs-sticky_header ${isSticky ? 'cs-sticky_header_active' : ''}`}
      >
        <Div className="cs-main_header">
          <Div className="container">
            <Div className="cs-main_header_in">
              <Div className="cs-main_header_left">
                <Link className="cs-site_branding" to="/">
                  <img src="/images/6200_2-04.svg" alt="Logo" />
                </Link>
              </Div>
              <Div className="cs-main_header_center">
                <Div className="cs-nav cs-primary_font cs-medium">
                  <ul
                    className="cs-nav_list"
                    style={{ display: `${mobileToggle ? 'block' : 'none'}` }}
                  >
                    <li>
                      <NavLink to="/" onClick={() => setMobileToggle(false)}>
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/material" onClick={() => setMobileToggle(false)}>
                        Material
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/maze" onClick={() => setMobileToggle(false)}>
                        Maze
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/coming-soon" onClick={() => setMobileToggle(false)}>
                        Quiz
                      </NavLink>
                    </li>
                  </ul>
                  <span
                    className={
                      mobileToggle
                        ? 'cs-munu_toggle cs-toggle_active'
                        : 'cs-munu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                </Div>
              </Div>
              <Div className="cs-main_header_right">
                {/* Render StartButton, Profile, or LogoutButton based on authentication state */}
                {!isAuthenticated ? (
                  <StartButton />
                ) : (
                  <>
                    <Profile />
                    <LogoutButton />
                  </>
                )}
              </Div>
            </Div>
          </Div>
        </Div>
      </header>
    </>
  );
}
