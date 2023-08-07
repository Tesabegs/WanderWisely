import React from 'react';
import {Link} from 'react-router-dom';

import Button from 'react-bootstrap/Button';


import './styles.css';

// import hero from './images/hero.png';
import italy from './images/italy.png';
import iceland from './images/iceland.png';
import greece from './images/greece.png';
import peru from './images/peru.png';
import tokyo from './images/tokyo.png';
import rome from './images/rome.png';
import paris from './images/paris.png';




const Home = () => {

  return (
    <div className="containers">
        <div className='hero-image'id="overlay">

        <div className="hero">
          <div className="hero-text">
            <div className="hero-title">Discover Your Perfect Getaway</div>
            <div className="hero-description">
              From breathtaking beaches to thrilling adventures and cultural treasures, find the perfect travel experience for you.
            </div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Enter a country" className="search-input" />
            <Link to="/destination/details">
              {/* <button className="search-button">Discover</button> */}
              <Button variant='default' style={{ color: "white", background: "black" }}>
                 Discover
              </Button>
            </Link>
          </div>
        </div>
        </div>
    
      <div className="main-content">
        <div className="content-title">World's Most Captivating Countries</div>
        <div className="featured-countries">
          <div className="country-card">
            <img src={italy} alt="Italy" className="country-image" />
            <div className="country-info">
              <div className="country-name">Italy</div>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="country-card">
            <img src={iceland} alt="Iceland" className="country-image" />
            <div className="country-info">
              <div className="country-name">Iceland</div>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="country-card">
            <img src={peru} alt="Peru" className="country-image" />
            <div className="country-info">
              <div className="country-name">Peru</div>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="country-card">
            <img src={greece} alt="Greece" className="country-image" />
            <div className="country-info">
              <div className="country-name">Greece</div>
              <button className="explore-button">Explore</button>
            </div>
          </div>
        </div>
      </div>
      <div className='sub-content'> 
        <div className='subcontent-title'>
          <div className='content-title2'>Destinations to explore</div>
          <a href="#" className="view-all-link">View all</a>
        </div>
        <div className='featured-destination'>
          <div className='destination-card'>
            <img src={paris} alt="Paris,France" className="destination-image" />
            <div className="destination-info">
              <div className='tag1'> 20+ exciting places to visit</div>
              <div className="destination-name">Paris, France</div>
              <div className="destination-details">Known as the "City of Love," Paris entices visitors with its romantic ambiance, iconic landmarks like the Eiffel Tower and Notre-Dame, world-class museums such as the Louvre, charming streets, and exquisite cuisine.</div>
              <div className='tag2'>
                <div className='beach'>Beach</div>
                <div className='art'>Art</div>
                <div className='culture'>Culture</div>
                <div className='fashion'>Fashion</div>
              </div>
            </div>
          </div>
          <div className='destination-card'>
            <img src={tokyo} alt="Tokyo, Japan" className="destination-image" />
            <div className="destination-info">
            <div className='tag1'> 20+ exciting places to visit</div>
              <div className="destination-name">Tokyo, Japan</div>
              <div className="destination-details">Vibrant metropolis that seamlessly blends traditional and modern elements. From serene gardens and historic temples to futuristic skyscrapers and cutting-edge technology, Tokyo offers a captivating mix of ancient traditions and contemporary innovation.</div>
              <div className='tag2'>
                <div className='beach'>Beach</div>
                <div className='art'>Art</div>
                <div className='culture'>Culture</div>
              </div>
            </div>
          </div>
          <div className='destination-card'>
            <img src={rome} alt="Rome, Italy" className="destination-image" />
            <div className="destination-info">
            <div className='tag1'> 20+ exciting places to visit</div>
              <div className="destination-name">Rome, Italy</div>
              <div className="destination-details">Treasure trove of history, art, and architecture. It is home to iconic attractions such as the Colosseum, Roman Forum, and Vatican City. Explore the Vatican Museums and marvel at the Sistine Chapel, toss a coin into the Trevi Fountain and more.</div>
              <div className='tag2'>
                <div className='history'>History</div>
                <div className='art'>Art</div>
                <div className='food'>Food</div>
              </div>
            </div>
          </div>
        </div>

      
      
      </div>
    </div>
  );
}

export default Home;
