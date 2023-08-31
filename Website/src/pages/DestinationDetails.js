import React, { useState, useEffect } from 'react';
import { json, useLocation } from 'react-router-dom'

import './styles.css';


import {Container, Row, Col, Button, Card, Pagination} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';


import paris from './images/image.png';

const DestinationDetails = () => {
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showHotelUbModal, setShowHotelUbModal] = useState(false);
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
                setShowHotelUbModal(false)
                break;
            
            case "hotel_ub":
                setShowHotelModal(false)
                setShowAttractionModal(false)
                setShowRestaurantModal(false)
                setShowHotelUbModal(true)

                break;

            case "attraction":
                setShowHotelModal(false)
                setShowAttractionModal(true)
                setShowRestaurantModal(false)
                setShowHotelUbModal(false)
                break;
            
            case "restaurant":
                setShowHotelModal(false)
                setShowAttractionModal(false)
                setShowRestaurantModal(true)
                setShowHotelUbModal(false)

                break;
        
            default:
                break;
        }
    };
    
    const handleCloseModal = () => {
        setSelectedCardIndex(-1);
        setShowHotelModal(false);
        setShowHotelUbModal(false);
        setShowAttractionModal(false);
        setShowRestaurantModal(false);
    };

    function trimTextToNCharacters(text, n=501) {
        if (text.length <= n) {
            return text;
        } else {
            return text.substring(0, n) + '...';
        }
    }
    const [showCookieModal, setShowCookieModal] = useState(true);

    const CookieConsent = ({onAccept}) => {
        const [showPrompt, setShowPrompt] = useState(true);

        const handleAccept =() => {
            setShowPrompt(false);
            onAccept(true);
        };

        const handleDecline = () => {
            setShowPrompt(false);
            onAccept(false);
        };

        if (!showPrompt) {
            return null;
        }

        return(
            <Modal show={true} onHide={() => setShowPrompt (false)}>
                <Modal.Header >
                    <Modal.Title> Cookie Consent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This website uses cookies to give you the most relevant information. Your consent is needed to set cookies on your device. </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleAccept}> Accept Cookies</Button>
                    <Button variant='secondary' onClick={handleDecline}> Decline Cookies</Button>
                </Modal.Footer>
            </Modal>
            
        );

    };
    const [cookiesAccepted, setCookiesAccepted] = useState(false);
    const handleCookiesAcceptance = (accepted) => {
        if (accepted) {
            setCookiesAccepted(true);

        }
  };

    // get the value of a cookie by name
      function getCookie(name) {
        const cookies = document.cookie.split('; ');
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            const cookieName = decodeURIComponent(cookie[0]);
            
            if (cookieName === name) {
                return decodeURIComponent(cookie[1]);
            }
        }
        
        return null;
    }

    const setReviewCookie = (name, data, country) => {
        if (cookiesAccepted) {
            let random = Math.floor(Math.random() * (data.length))

            let trimmedData = trimTextToNCharacters(data[random].user_review)

            let existingData = JSON.parse(getCookie(name)) ?? {}

            // existingData[country] = JSON.stringify(trimmedData)
            existingData[country] = trimmedData

            existingData = JSON.stringify(existingData)
        
            Cookies.set(name, existingData);

            console.log("cookie data by name => ", getCookie(name))
            console.log("cookie data by value => ", JSON.parse(getCookie(name)))
            console.log("cookie data => ", decodeURIComponent(document.cookie))

        }
        
    
    }; 


    //API integration with fetch
    const [getApiResponse, setGetApiResponse] = useState([]);
    const data = useLocation()
    const { location } = data.state

    
    const handleGetRequest = async (location, cookie_data) => {
        const baseurl = `http://127.0.0.1:5000/hotels?location=${location}`;
      
        const data_ = {cookie_data};

        try {
            
            const response = await fetch(baseurl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_)
              });
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
        // async function callHandleGetRequest() {
        //     await handleGetRequest(location);
        // }
        // callHandleGetRequest();

        let cookie_data_obj = getCookie("Hotel")
        let cookie_data = ""


        if (cookie_data_obj != null) {
            cookie_data_obj= JSON.parse(cookie_data_obj);

            for (const k in cookie_data_obj) {
                if (k == location.toLowerCase()) {
                    cookie_data = cookie_data_obj[k]
                }
            }
        }

        handleGetRequest(location, cookie_data);
    
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

    //Cards data user based flow
    const [currentHotelUbPage, setCurrentHotelUbPage] = useState(1);
    const handleHotelUbPageChange = (newPage) => {
        setCurrentHotelUbPage(newPage);
    };


    if (loading) { 
        return;
    }

    const ModalItem = ({cards, showModal, category}) => {
        

        // for the user_based flow, convert review_data to an array
        for (let i = 0; i<cards.length; i++) {

            let review_data = cards[i].review_data

            if (typeof review_data === 'object' && review_data !== null && !Array.isArray(review_data)) {
                cards[i].review_data = [cards[i].review_data]
            }
        }
        
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
                                { cards[selectedCardIndex].review_data.map((review, index) => (
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
                                
                                <div >
                                    <button className='modal-button' onClick={() => setReviewCookie(category, cards[selectedCardIndex].review_data, cards[selectedCardIndex].country)}> Discover this location</button>
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
                            <Card.Img variant="top" fluid src={item.image_link} />
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
                                        {item.description.length > 120
                                            ? item.description.substring(0,120) + "..."
                                            : item.description}
                                    
                                    </Card.Text>
                                    {/* <Button variant="primary">Go somewhere</Button> */}
                                </Card.Body>                     
                        </Card>
                    </Col>
                ))}
               <ModalItem cards={cards} showModal={showHotelModal} category={"Hotel"} ></ModalItem>
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
                            <Card.Img variant="top" fluid src={item.image_link} />
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
                                        {item.description.length > 120
                                            ? item.description.substring(0,120) + "..."
                                            : item.description} 
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
                            <Card.Img variant="top" fluid src={item.image_link} />
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
                                        {item.description.length > 120
                                            ? item.description.substring(0,120) + "..."
                                            : item.description}
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

    //Hotel data user based
    const HotelUbCardsData = getApiResponse.hotel_data_ub;


    const HotelUbCardsPerPage = 3;
    const totalHotelUbCards = HotelUbCardsData?.length;
    const lastHotelUbCardIndex = currentHotelUbPage * HotelUbCardsPerPage;
    const firstHotelUbCardIndex = lastHotelUbCardIndex - HotelUbCardsPerPage;
    const currentHotelUbCards = HotelUbCardsData?.slice(firstHotelUbCardIndex, lastHotelUbCardIndex);
    const totalHotelUbPages = Math.ceil(totalHotelUbCards / HotelUbCardsPerPage);

    const HotelUbCardList = ({cards}) => {
        return (
            <Row>
                {cards.map((item, index) => (
                    <Col key={index}>
                        {/* onClick={() => handleCardClick(index, "hotel")} */}
                        <Card style={{ width: '21rem', cursor: 'pointer' }} onClick={() => handleCardClick(index, "hotel_ub")} >
                            <Card.Img variant="top" fluid src={item.image_link} />
                            <Card.Body className='card-body'>
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
                                       {item.description.length > 120
                                            ? item.description.substring(0,120) + "..."
                                            : item.description}
                                    </Card.Text>
                                    {/* <Button variant="primary">Go somewhere</Button> */}
                                </Card.Body>
                        </Card>
                    </Col>
                ))}
               <ModalItem cards={cards} showModal={showHotelUbModal} category={"Hotel"}></ModalItem>
            </Row>
        );
    };

    const HotelUbData = () => {
        if (HotelUbCardsData.length > 0) {
            return <div style={{marginTop:"20px"}}>
                        <h3 className='interest-text'>Based on your Interests</h3>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h5>Hotels</h5>
                        <Pagination>
                            {Array.from({ length: totalHotelUbPages }).map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === currentHotelUbPage} onClick={() => handleHotelUbPageChange(index + 1)}>                                                                         
                            {index + 1}
                            </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                    
                    <HotelUbCardList cards={currentHotelUbCards} selectedCardIndex={selectedCardIndex} onCardClick={setSelectedCardIndex}/> 
                </div>
        }
    }
    
    return (
        

        <Container className='details-container'>

            {!cookiesAccepted && <CookieConsent onAccept= {handleCookiesAcceptance}/> }
            <h2> {data.state.location.toUpperCase()} </h2>

            
            <p className='location-details'>{getApiResponse.country_data[0].description}</p>
            
            {/* Hotels */}
            <HotelData />

            {/* Attractions */}
            <AttractionData />

            {/* Restaurants */}
            <RestaurantData />

            {/* Hotels User based*/}
            <HotelUbData />
        
        </Container>
    );
  }
  
  export default DestinationDetails;
