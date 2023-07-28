import React from 'react';
import './styles.css';

import paris from './images/paris.png';


const DestinationDetails = () => {
    return (
        <div> 
            <div className='location-container'>
                <div className='location-title'>Ontario, Canada</div>
                <div className='location-details'>Marrakech is a vibrant and enchanting city located in the heart of Morocco. Lose yourself in the maze-like streets of the medina, experience the lively atmosphere of Djemaa el-Fna square, explore the stunning Bahia Palace and the vibrant souks, and relax in tranquil gardens. Immerse yourself in Moroccan culture, indulge in traditional cuisine, and marvel at the intricate craftsmanship of the city's architecture, making Marrakech an alluring destination.</div>
                <div className='location-images'></div>
            </div>
            <div className='hotels-container'>
                <div className='subcontent-title'>
                    <div className='content-title2'>Hotels</div>
                    <div className='content-button'>place the button in here</div>
                </div>
                <div className='hotels'>
                    <div className='hotel-card'>
                        <img src={paris} alt="Paris,France" className="destination-image" />
                        <div className="hotel-info">
                            <div className='name-rating'>
                                <div className="hotel-name">Paris, France</div>
                                <div className="hotel-rating">put the rating here</div>
                            </div>
                            <div className="hotel-details">Known as the "City of Love," Paris entices visitors with its romantic ambiance, iconic landmarks like the Eiffel Tower and Notre-Dame, world-class museums such as the Louvre, charming streets, and exquisite cuisine.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='restaurant-container'>

            </div>

            <div className='attractions-container'>

            </div>

            <div className='reels-container'></div>
        </div> 
      
    );
  }
  
  export default DestinationDetails;