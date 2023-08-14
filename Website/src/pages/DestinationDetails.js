import React, { useState, useEffect } from 'react';
import './styles.css';


import {Container, Row, Col, Button, Card, Pagination} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { Modal } from 'react-bootstrap';



import paris from './images/image.png';

const DestinationDetails = () => {
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = (index) => {
        setSelectedCardIndex(index);
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setSelectedCardIndex(-1);
        setShowModal(false);
    };

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
    const HotelsCardList = ({cards}) => {
        
        return (
            <Row>
                {cards.map((item, index) => (
                    <Col key={index}>
                        <Card style={{ width: '21rem', cursor: 'pointer' }} onClick={() => handleCardClick(index)}>
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
                                    {/* <Button variant="primary">Go somewhere</Button> */}
                                </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Modal size='lg' show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Hotel Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        {selectedCardIndex !== -1 && (
                            <div className='modal-details'>
                                <div className='modal-hotelname'>
                                    {cards[selectedCardIndex].hotel_name}
                                    <Rating initialValue={cards[selectedCardIndex].hotel_rating} allowFraction={true} readonly={true} size={25}/>
                                </div>
                                <div className='modal-hotelamenities'>
                                    {cards[selectedCardIndex].amenities}
                                </div>
            
                                <div className='top-reviewers'>
                                    <div className='modal-hotelname'>Top Reviews</div>
                                    {cards[selectedCardIndex].review_data.map((review, index) => (
                                        <div key={index}>
                                            <div className='reviews' >
                                                <div >{review.user_name}</div>
                                                <Rating initialValue={review.user_rating} allowFraction={true} readonly={true} size={25} />
                                            </div>
                                            <div className='review-words' key={index}>
                                                {review.user_review}
                                            </div>
                                        </div>
                                    ))}
                                <div className='modal-button'>
                                    <Button variant='default'> Discover this location</Button>
                                </div>
                                </div>
                            </div>
                                
                        )}
                    </Modal.Body>
                </Modal>

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

            <div >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h5>Hotels</h5>
                    <Pagination>
                        {Array.from({ length: totalHotelPages }).map((_, index) => (
                        <Pagination.Item key={index} active={index + 1 === currentHotelPage} onClick={() => handleHotelPageChange(index + 1)}>                                                                         
                        {index + 1}
                        </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
               
                <HotelsCardList cards={currentHotelCards} selectedCardIndex={selectedCardIndex} onCardClick={setSelectedCardIndex}/>
            </div>


       

        </Container>

    );
  }
  
  export default DestinationDetails;



