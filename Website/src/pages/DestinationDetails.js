import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import './styles.css';


import {Container, Row, Col, Button, Card, Pagination} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';



import paris from './images/image.png';

const DestinationDetails = () => {
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showAttractionModal, setShowAttractionModal] = useState(false);
    const [showRestaurantModal, setShowRestaurantModal] = useState(false);

    const [loading, setLoading] = useState(true);


    const handleCardClick = (index, str) => {
        setSelectedCardIndex(index);
        switch (str) {
            case "hotel":
                setShowHotelModal(true)
                setShowAttractionModal(false)
                setShowRestaurantModal(false)
                break;

            case "attraction":
                setShowHotelModal(false)
                setShowAttractionModal(true)
                setShowRestaurantModal(false)
                break;
            
            case "restaurant":
                setShowHotelModal(false)
                setShowAttractionModal(false)
                setShowRestaurantModal(true)
                break;
        
            default:
                break;
        }
    };
    
    const handleCloseModal = () => {
        setSelectedCardIndex(-1);
        setShowHotelModal(false);
        setShowAttractionModal(false)
        setShowRestaurantModal(false)
    };

    const setReviewCookie = (reviewData) => {
        Cookies.set('user_review', JSON.stringify(reviewData));
        console.log("cookie data => ", decodeURIComponent(document.cookie))

        
      };      

    //API integration with fetch
    const [getApiResponse, setGetApiResponse] = useState([]);
    const data = useLocation()
    const { location } = data.state

    
    const handleGetRequest = async (location) => {
        const baseurl = `http://127.0.0.1:5000/hotels?location=${location}`;

        try {
            const response = await fetch (baseurl);
            const data = await response.json();
            setGetApiResponse(data);
            setLoading(false)
            console.log("data is : ", data)
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false)
        }
    };


    useEffect(() => {
        // Fetch data on page load
        handleGetRequest(location);
      }, [location]);


    //CardsData is the original list/array
   
    const [currentHotelPage, setCurrentHotelPage] = useState(1);
    const handleHotelPageChange = (newPage) => {
        setCurrentHotelPage(newPage);
    };

    const [currentAttractionPage, setCurrentAttractionsPage] = useState(1);
    const handleAttractionPageChange = (newPage) => {
        setCurrentAttractionsPage(newPage);
    };

    const [currentRestaurantPage, setCurrentRestaurantPage] = useState(1);
    const handleRestaurantPageChange = (newPage) => {
        setCurrentRestaurantPage(newPage);
    };

    if (loading) { 
        return;
    }

    const ModalItem = ({cards, showModal, category}) => {
        return <Modal size='lg' show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{category} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {selectedCardIndex !== -1 && (
                        <div className='modal-details'>
                            <div className='modal-hotelname'>
                                {cards[selectedCardIndex].name}
                                <Rating initialValue={cards[selectedCardIndex].rating} allowFraction={true} readonly={true} size={25}/>
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
                                <Button variant='default'  onClick={() => setReviewCookie(cards[selectedCardIndex].review_data)}> Discover this location</Button>
                            </div>
                            </div>
                        </div>
                            
                    )}
                </Modal.Body>
            </Modal>
    }

    //Hotel
    const HotelsCardsData = getApiResponse.hotel_data;
    const HotelsCardsPerPage = 3;
    const totalHotelCards = HotelsCardsData?.length;
    const lastHotelCardIndex = currentHotelPage * HotelsCardsPerPage;
    const firstHotelCardIndex = lastHotelCardIndex - HotelsCardsPerPage;
    const currentHotelCards = HotelsCardsData?.slice(firstHotelCardIndex, lastHotelCardIndex);
    const totalHotelPages = Math.ceil(totalHotelCards / HotelsCardsPerPage);

    const HotelsCardList = ({cards}) => {
        return (
            <Row>
                {cards.map((item, index) => (
                    <Col key={index}>
                        <Card style={{ width: '21rem', cursor: 'pointer' }} onClick={() => handleCardClick(index, "hotel")}>
                            <Card.Img variant="top" fluid src={paris} />
                            <Card.Body>
                                    <div style={{display : "flex", justifyContent:"space-between"}}>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Row>
                                            <Rating
                                            initialValue={item.rating}
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
               <ModalItem cards={cards} showModal={showHotelModal} category={"Hotel"}></ModalItem>
            </Row>
        );
    };

    const HotelData = () => {
        if (HotelsCardsData.length > 0) {
            return <div>
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
        }
        else {
            return <div style={{marginTop:"25px"}}>No Hotel data yet for {data.state.location.toUpperCase()} </div>
        }
        
    }

      //Attraction
      const AttractionsCardsData = getApiResponse.attraction_data;
      const AttractionsCardsPerPage = 3;
      const totalAttractionCards = AttractionsCardsData?.length;
      const lastAttractionCardIndex = currentAttractionPage * AttractionsCardsPerPage;
      const firstAttractionCardIndex = lastAttractionCardIndex - AttractionsCardsPerPage;
      const currentAttractionCards = AttractionsCardsData?.slice(firstAttractionCardIndex, lastAttractionCardIndex);
      const totalAttractionPages = Math.ceil(totalAttractionCards / AttractionsCardsPerPage);
  
      const AttractionsCardList = ({cards}) => {
          return (
              <Row>
                  {cards.map((item, index) => (
                      <Col key={index}>
                          <Card style={{ width: '21rem', cursor: 'pointer' }} onClick={() => handleCardClick(index, "attraction")}>
                              <Card.Img variant="top" fluid src={paris} />
                              <Card.Body>
                                      <div style={{display : "flex", justifyContent:"space-between"}}>
                                          <Card.Title>{item.name}</Card.Title>
                                          <Row>
                                              <Rating
                                              initialValue={item.rating}
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
                 <ModalItem cards={cards} showModal={showAttractionModal} category={"Attraction"}></ModalItem>
              </Row>
          );
      };

      const AttractionData = () => {
        if (AttractionsCardsData.length > 0) {
            return <div style={{marginTop:"25px"}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h5>Attractions</h5>
                        <Pagination>
                            {Array.from({ length: totalAttractionPages }).map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === currentAttractionPage} onClick={() => handleAttractionPageChange(index + 1)}>                                                                         
                            {index + 1}
                            </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                
                    <AttractionsCardList cards={currentAttractionCards} selectedCardIndex={selectedCardIndex} onCardClick={setSelectedCardIndex}/>
                 </div>
        }
        else {
            return <div style={{marginTop:"25px"}}>No Attractions data yet for {data.state.location.toUpperCase()} </div>
        }
    }
  

    //Restaurant
    const RestaurantsCardsData = getApiResponse.restaurant_data;
    const RestaurantsCardsPerPage = 3;
    const totalRestaurantCards = RestaurantsCardsData?.length;
    const lastRestaurantCardIndex = currentRestaurantPage * RestaurantsCardsPerPage;
    const firstRestaurantCardIndex = lastRestaurantCardIndex - RestaurantsCardsPerPage;
    const currentRestaurantCards = RestaurantsCardsData?.slice(firstRestaurantCardIndex, lastRestaurantCardIndex);
    const totalRestaurantPages = Math.ceil(totalRestaurantCards / RestaurantsCardsPerPage);

    const RestaurantsCardList = ({cards}) => {
        return (
            <Row>
                {cards.map((item, index) => (
                    <Col key={index}>
                        <Card style={{ width: '21rem', cursor: 'pointer' }} onClick={() => handleCardClick(index, "restaurant")}>
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
                <ModalItem cards={cards} showModal={showRestaurantModal} category={"Restaurant"}></ModalItem>
            </Row>
        );
    };

    const RestaurantData = () => {
        if (RestaurantsCardsData.length > 0) {
            return <div style={{marginTop:"25px"}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h5>Restaurants</h5>
                        <Pagination>
                            {Array.from({ length: totalRestaurantPages }).map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === currentRestaurantPage} onClick={() => handleRestaurantPageChange(index + 1)}>                                                                         
                            {index + 1}
                            </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                    <RestaurantsCardList cards={currentRestaurantCards} selectedCardIndex={selectedCardIndex} onCardClick={setSelectedCardIndex}/>
                </div>
        }
        else {
            return <div style={{marginTop:"25px"}}>No Restaurant data yet for {data.state.location.toUpperCase()} </div>
        }
    }
    
    return (

        <Container className='details-container'>
            <h2> {data.state.location.toUpperCase()} </h2>

            <p className='location-details'>Ontario is a vibrant and enchanting city located in the heart of Morocco. Lose yourself in the maze-like streets of the medina, experience the lively atmosphere of Djemaa el-Fna square, explore the stunning Bahia Palace and the vibrant souks, and relax in tranquil gardens. Immerse yourself in Moroccan culture, indulge in traditional cuisine, and marvel at the intricate craftsmanship of the city's architecture, making Marrakech an alluring destination.</p>
            
            {/* Hotels */}
            <HotelData />

            {/* Attractions */}
            <AttractionData />

            {/* Restaurants */}
            <RestaurantData />
        
        </Container>
    );
  }
  
  export default DestinationDetails;



