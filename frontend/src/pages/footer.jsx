// src/pages/Footer.jsx
import React from 'react';
import './footer.css'; // We will create this next
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Section 1: Brand */}
        <div className="footer-section brand">
          <h2 style={{color: '#ff9800'}}>WanderCall</h2>
          <p>Connecting people, anywhere, anytime. Fast, secure, and simple video calling for everyone.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/history">History</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="https://github.com/Manish-Baviskar/WanderCall-Video-Conferencing/blob/main/LICENSE">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Section 3: Socials */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://github.com/Manish-Baviskar" className="icon"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/manishbaviskar/" className="icon"><LinkedInIcon /></a>
            <a href="https://x.com/_manish_23" className="icon"><TwitterIcon /></a>
            <a href="https://www.instagram.com/manishbaviskar1/" className="icon"><InstagramIcon /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WanderCall. All rights reserved.</p>
      </div>
    </footer>
  );
}