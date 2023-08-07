import React from 'react';
import './styles.css';


import tokyo from './images/tokyo.png';
import rome from './images/rome.png';
import paris from './images/paris.png';

const DestinationList = () => {

    let destinations = [
    {
        imageUrl: paris, 
        placesCount : 15, 
        name :  "Paris, France", 
        details :  "Known as the 'City of Love,' Paris entices visitors with its romantic ambiance, iconic landmarks like the Eiffel Tower and Notre-Dame, world-class museums such as the Louvre, charming streets, and exquisite cuisine.",
        tags : ["Beach", "Art", "Culture", "Fashion"]
    } , 

    {
        imageUrl: tokyo, 
        placesCount : 20, 
        name :  "Tokyo, Japan", 
        details :  "Vibrant metropolis that seamlessly blends traditional and modern elements. From serene gardens and historic temples to futuristic skyscrapers and cutting-edge technology, Tokyo offers a captivating mix of ancient traditions and contemporary innovation.",
        tags : ["Beach", "Art", "Culture"]
    } , 

    {
        imageUrl: rome, 
        placesCount : 25, 
        name :  "Rome, Italy", 
        details :  "Treasure trove of history, art, and architecture. It is home to iconic attractions such as the Colosseum, Roman Forum, and Vatican City. Explore the Vatican Museums and marvel at the Sistine Chapel, toss a coin into the Trevi Fountain and more.",
        tags : ["History", "Art", "Food"]
    } , 

    {
        imageUrl: rome, 
        placesCount : 25, 
        name :  "Rome, Italy", 
        details :  "Treasure trove of history, art, and architecture. It is home to iconic attractions such as the Colosseum, Roman Forum, and Vatican City. Explore the Vatican Museums and marvel at the Sistine Chapel, toss a coin into the Trevi Fountain and more.",
        tags : ["History", "Art", "Food"]
    } , 

    {
        imageUrl: rome, 
        placesCount : 25, 
        name :  "Rome, Italy", 
        details :  "Treasure trove of history, art, and architecture. It is home to iconic attractions such as the Colosseum, Roman Forum, and Vatican City. Explore the Vatican Museums and marvel at the Sistine Chapel, toss a coin into the Trevi Fountain and more.",
        tags : ["History", "Art", "Food"]
    } , 

    {
        imageUrl: rome, 
        placesCount : 25, 
        name :  "Rome, Italy", 
        details :  "Treasure trove of history, art, and architecture. It is home to iconic attractions such as the Colosseum, Roman Forum, and Vatican City. Explore the Vatican Museums and marvel at the Sistine Chapel, toss a coin into the Trevi Fountain and more.",
        tags : ["History", "Art", "Food"]
    } , 

    
        
    ]
  
    return (
     
     
    <div className='sub-content'> 
    
        <div className='subcontent-title'>
        <div className='content-title2'>Destinations to Explore</div>
        </div>
        <div className='featured-destination' >
        {destinations.map((destination) => {
            return <div className='destination-card'>
                        <img src={destination.imageUrl} alt={destination.name} className="destination-image" />
                        <div className="destination-info">
                        <div className='tag1'> {destination.placesCount}+ exciting places to visit</div>
                        <div className="destination-name">{destination.name}</div>
                        <div className="destination-details">{destination.details}</div>
                        <div className='tag2'>
                            {destination.tags.map((tag) => {
                                return <div className={tag.toLowerCase()}>{tag}</div>
                            })}
                        </div>
                        </div>
                    </div>
        })}
        </div>
        
    </div>
    
       
    
  );
}

export default DestinationList;
