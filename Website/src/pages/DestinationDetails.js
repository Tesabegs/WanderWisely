import React, { useState, useEffect } from 'react';
import './styles.css';


import {Container, Row, Col, Button, Card, Pagination} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'

import paris from './images/image.png';

const DestinationDetails = () => {

    //API integration with fetch
    const baseurl = "http://127.0.0.1:5000/hotels?location=canada";
    const [getApiResponse, setGetApiResponse] = useState([]);
  
    const handleGetRequest = async () => {
      try {
        const response = await fetch (baseurl);
        const data = await response.json();
        setGetApiResponse(data);
        console.log("data is : ", data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
        // Fetch data on page load
        handleGetRequest();
      }, []);

    //CardsData is the original list/array
    const HotelsCardsData = getApiResponse;
    const HotelsCardsPerPage = 3;
    const HotelsCardList = ({ cards }) => {

        return (
            <Row>
                {cards.map((item) => { 
                    return <Col>
                            <Card style={{ width: '21rem' }}>
                                <Card.Img variant="top" fluid src={paris} />
                                <Card.Body>
                                    <div style={{display : "flex", justifyContent:"space-between"}}>
                                        <Card.Title>{item.hotel_name}</Card.Title>
                                        <Row>
                                            <Rating
                                            initialValue={item.hotel_rating}
                                            allowFraction={true}
                                            readonly={true}
                                            size={25}
                                            />
                                        </Row>
                                    </div>
                                    <Card.Text>
                                       quick example text to build on the card title and make up the
                                        bulk of the card's content. 
                                    </Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    })
                }
            </Row>
        );
    };

    const [currentHotelPage, setCurrentHotelPage] = useState(1);
    const handleHotelPageChange = (newPage) => {
        setCurrentHotelPage(newPage);
    };

    const totalHotelCards = HotelsCardsData.length;
    const lastHotelCardIndex = currentHotelPage * HotelsCardsPerPage;
    const firstHotelCardIndex = lastHotelCardIndex - HotelsCardsPerPage;
    const currentHotelCards = HotelsCardsData.slice(firstHotelCardIndex, lastHotelCardIndex);
    const totalHotelPages = Math.ceil(totalHotelCards / HotelsCardsPerPage);

    return (

        <Container className='details-container'>
            <h2>Ontario, Canada</h2>

            <p className='location-details'>Ontario is a vibrant and enchanting city located in the heart of Morocco. Lose yourself in the maze-like streets of the medina, experience the lively atmosphere of Djemaa el-Fna square, explore the stunning Bahia Palace and the vibrant souks, and relax in tranquil gardens. Immerse yourself in Moroccan culture, indulge in traditional cuisine, and marvel at the intricate craftsmanship of the city's architecture, making Marrakech an alluring destination.</p>

            <div>
                <h5>Hotels</h5>
                <div style={{display: "flex", paddingRight:"5rem", justifyContent:"flex-end"}}>
                    <Pagination>
                        {Array.from({ length: totalHotelPages }).map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentHotelPage}
                            onClick={() => handleHotelPageChange(index + 1)}
                        >                                                                         
                        {index + 1}
                        </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
               
                <HotelsCardList cards={currentHotelCards} />
            </div>

            <br></br> <br></br> <br></br>

            {/* <div>
                <h5>Restaurants</h5>
                <Pagination>
                    {Array.from({ length: totalPages }).map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                    ))}
                </Pagination>
                <CardList cards={currentCards} />
            </div> */}

        </Container>

        // <div className='container'> 
        //     <div className='location-container'>
        //         <div className='location-title'>Ontario, Canada</div>
        //         <div className='location-details'>Marrakech is a vibrant and enchanting city located in the heart of Morocco. Lose yourself in the maze-like streets of the medina, experience the lively atmosphere of Djemaa el-Fna square, explore the stunning Bahia Palace and the vibrant souks, and relax in tranquil gardens. Immerse yourself in Moroccan culture, indulge in traditional cuisine, and marvel at the intricate craftsmanship of the city's architecture, making Marrakech an alluring destination.</div>
        //         <div className='location-images'></div>
        //     </div>
        //     <div className='hotels-container'>
        //         <div className='subcontent-title'>
        //             <div className='content-title2'>Hotels</div>
        //             <div className='content-button'>place the button in here</div>
        //         </div>
        //         <div className='hotels'>
        //             <div className='hotel-card'>
        //                 <img src={paris} alt="Paris,France" className="destination-image" />
        //                 <div className="hotel-info">
        //                     <div className='name-rating'>
        //                         <div className="hotel-name">Paris, France</div>
        //                         <div className="hotel-rating">put the rating here</div>
        //                     </div>
        //                     <div className="hotel-details">Known as the "City of Love," Paris entices visitors with its romantic ambiance, iconic landmarks like the Eiffel Tower and Notre-Dame, world-class museums such as the Louvre, charming streets, and exquisite cuisine.</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     <div className='restaurant-container'>

        //     </div>

        //     <div className='attractions-container'>

        //     </div>

        //     <div className='reels-container'></div>
        // </div> 
      
    );
  }
  
  export default DestinationDetails;