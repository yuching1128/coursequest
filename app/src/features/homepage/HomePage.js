import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../userProfile/userProfileSlice";

import searchingImg from '../../images/searching.png';
import reviewImg from '../../images/review.png';
import connectImg from '../../images/connect.png';
export default function HomePage() {
    const userProfile = useSelector(selectUserProfile)
    return (
        <Container className="HomePage">
            <h1>Homepage</h1>
            {
                Boolean(userProfile) ? (<p className="welcome-title">Welcome to CourseQuest, {userProfile.given_name}!</p>) :
                    <p className="welcome-title">Welcome to CourseQuest!</p>
            }
            <p className="welcome-text">CourseQuest is a perfect platform for all your course selection needs. We understand the importance of choosing the right courses for your academic and professional growth. Start exploring courses, reading reviews, and connecting with other students to enhance your academic experience.</p>
            <div>
                <div className="welcomeIcon">
                    <img className="searchingImage" src={searchingImg} alt="searching" />
                    <p className="iconText">Search Course</p>
                </div>
                <div className="welcomeIcon">
                    <img className="reviewImage" src={reviewImg} alt="review" />
                    <p className="iconText">Ratings & Reviews</p>
                </div>
                <div className="welcomeIcon">
                    <img className="connectImage" src={connectImg} alt=" connect" />
                    <p className="iconText-connect">Connections</p>
                </div>
            </div>

        </Container>
    );
}