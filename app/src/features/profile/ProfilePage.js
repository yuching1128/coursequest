import Container from "react-bootstrap/Container";
import React, {useEffect, useState} from "react";
import Accordion from "react-bootstrap/Accordion";
import {faCircleUser} from "@fortawesome/free-regular-svg-icons";
import {faBook} from"@fortawesome/free-solid-svg-icons"
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {faUserGraduate} from"@fortawesome/free-solid-svg-icons"
import {faPenToSquare} from "@fortawesome/free-regular-svg-icons";
import {faSquareCheck} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    useAddUserCourseInterestedMutation,
    useAddUserCourseTakenMutation,
    useGetCoursesQuery,
    useGetMajorQuery,
    useGetUserInfoQuery
} from "../api/apiSlice";
import {useParams} from "react-router-dom";
import Select from "react-select";
import {UserInfo} from "./UserInfo";
import {UserProgram} from "./UserProgram";

export const ProfilePage = () => {

    const { userId } = useParams();
    const [universityId, setUniversityId] = useState(1)

    const {
        data: userProfileData,
        isSuccess: userProfileSuccess,
    } = useGetUserInfoQuery({userId: userId});

    // useEffect(() => {
    //     if (userProfileData && userProfileData.university){
    //         setUniversityId(userProfileData.university.id)
    //     }
    // },[userProfileData])

    // set course taken select options
    const [courseTaken, setCourseTaken] = useState([]);
    const [selectedCoursesId, setSelectedCoursesId] = useState([]);
    const [addUserCourseTaken, { isLoading: courseTakenIsLoading}] = useAddUserCourseTakenMutation();
    const [defaultCourseTaken, setDefaultCourseTaken] = useState([]);

    const [selectedCoursesInterestId, setSelectedCoursesInterestedId] = useState([]);
    const [addUserCourseInterested, { isLoading: courseInterestedIsLoading}] = useAddUserCourseInterestedMutation();
    const [defaultCourseInterested, setDefaultCourseInterested] = useState([]);

    const [mentoringOn, setMentoringOn] = useState([]);

    useEffect(() => {
        if (userProfileData && userProfileData.course) {
            const courseTakenOptions = userProfileData.course.map((course) => ({
                value: course.id,
                label: course.name,
            }));
            setDefaultCourseTaken(courseTakenOptions);
            setMentoringOn(courseTakenOptions);
            const selectedCoursesId = userProfileData.course.map((course) => ({
                id: course.id,
            }));
            setSelectedCoursesId(selectedCoursesId);
        }
        if(userProfileData && userProfileData.interestedCourse) {
            const courseInterestedOptions = userProfileData.interestedCourse.map((course) => ({
                value: course.id,
                label: course.name,
            }));
            setDefaultCourseInterested(courseInterestedOptions);
            const selectedCoursesInterestId = userProfileData.interestedCourse.map((course) => ({
                id: course.id,
            }));
            setSelectedCoursesInterestedId(selectedCoursesInterestId);
        }
    }, [userProfileData]);

    const {
        data: courseTakenData,
        isSuccess: courseTakenSuccess,
    } = useGetCoursesQuery({universityId: universityId, page: "", size: ""});

    useEffect(() => {
        if (courseTakenSuccess) {
            const courseTakenOptions = courseTakenData.map((courseTaken) => ({
                value: courseTaken.id,
                label: courseTaken.name,
            }));
            setCourseTaken([ ,...courseTakenOptions,
            ]);
        }
    }, [courseTakenSuccess, courseTakenData]);

    // set mentoring on select options based on course taken
    const [selectedMentorOn, setSelectedMentorOn] = useState([]);

    const handleCourseSelection = (selectedOptions) => {
        setDefaultCourseTaken(selectedOptions)
        setSelectedCoursesId(
            selectedOptions.map((option) => ({
                id: option.value,
            }))
        );
        const filteredSelectedMentorOn = selectedMentorOn.filter((option) =>
            selectedOptions.some((subject) => subject.value === option.value)
        );
        setSelectedMentorOn(filteredSelectedMentorOn);
        setMentoringOn(selectedOptions);
    };

    const handleCourseInterestedSelects = (selectedOptions) => {
        setDefaultCourseInterested(selectedOptions)
        setSelectedCoursesInterestedId(
            selectedOptions.map((option) => ({
                id: option.value,
            }))
        );
    }

    useEffect(() => {
        // Filter out any selected options that are not in the courseTaken options
        const filteredMentoringOn = mentoringOn.filter((option) =>
            courseTaken.some((subject) => subject.value === option.value)
        );
        setMentoringOn(filteredMentoringOn);
    }, [courseTaken]);

    // set concentration interested
    const [concentration, setConcentration] = useState(null);
    const [selectedConcentration, setSelectedConcentration] = useState(null);

    const {
        data: concentrationData,
        isSuccess: concentrationSuccess,
    } = useGetMajorQuery();

    useEffect(() => {
        if (concentrationSuccess) {
            const concentrationOptions = concentrationData.map((concentration) => ({
                value: concentration.name,
                label: concentration.name,
            }));
            setConcentration([ ,...concentrationOptions,
            ]);
        }
    }, [concentrationSuccess, concentrationData]);

    const handleConcentrationChange = (selectedOption) => {
        const selectedConcentrationObj = concentrationData.find(
            (concentration) => concentration.name === selectedOption.value
        );
        // Set the selected university ID as the state
        setSelectedConcentration(selectedConcentrationObj?.id || null);
    };

    // edit and done for each section
    const [interestIsEditing, setInterestIsEditing] = useState(false);

    const handleInterestEditClick = () => {
        setInterestIsEditing(true);
    };

    const handleInterestDoneClick = async () => {
        await addUserCourseTaken({userId: userId, courseList: selectedCoursesId})
        await addUserCourseInterested({userId: userId, courseList: selectedCoursesInterestId})
        setInterestIsEditing(false);
    };

    const [mentoringIsEditing, setMentoringIsEditing] = useState(false);

    const handleMentoringEditClick = () => {
        setMentoringIsEditing(true);
    };

    const handleMentoringDoneClick = () => {
        setMentoringIsEditing(false);
    };

    return (
        <Container>
            <Accordion alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="profileTitleText"><FontAwesomeIcon icon={faCircleUser} className="profileIcon"/>Information</Accordion.Header>
                    <Accordion.Body>
                        <UserInfo userProfileData={userProfileData}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header className="profileTitleText"><FontAwesomeIcon icon={faBook} className="profileIcon"/>Program</Accordion.Header>
                    <Accordion.Body>
                        <UserProgram userId={userId} userProfileData={userProfileData}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header className="profileTitleText"><FontAwesomeIcon icon={faHeart} className="profileIcon"/>Interest</Accordion.Header>
                    <Accordion.Body>
                        <div className="profileBlock">
                            <div className="courseBlockEdit">
                                {interestIsEditing ? (
                                    <button onClick={handleInterestDoneClick} className="profileEditDone"><FontAwesomeIcon icon={faSquareCheck} /> Done</button>
                                ) : (
                                    <button onClick={handleInterestEditClick} className="profileEditDone"><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                                )}
                            </div>
                            <div>
                                <p className="profileText">Courses Taken: </p>
                                <Select
                                    isMulti
                                    options={courseTaken}
                                    value={defaultCourseTaken}
                                    placeholder="Select the subjects you have taken"
                                    className="selectCourseTaken"
                                    onChange={handleCourseSelection}
                                    isDisabled={!interestIsEditing}
                                />
                            </div>
                            <div>
                                <p className="profileText">Courses Interested: </p>
                                <Select
                                    isMulti
                                    options={courseTaken}
                                    placeholder="Select the subjects you are interested in"
                                    className="selectCourseInterested"
                                    isDisabled={!interestIsEditing}
                                    onChange={handleCourseInterestedSelects}
                                    value={defaultCourseInterested}
                                />
                            </div>
                            <div>
                                <p className="profileText">Concentration Interested: </p>
                                <Select className="profileConcentration"
                                        options={concentration}
                                        placeholder="Select the concentration interested"
                                        isDisabled={!interestIsEditing}
                                        onChange={handleConcentrationChange}
                                />
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header className="profileTitleText"><FontAwesomeIcon icon={faUserGraduate} className="profileIcon"/>Mentoring on</Accordion.Header>
                    <Accordion.Body>
                        <div className="profileBlock">
                            <div className="courseBlockEdit">
                                {mentoringIsEditing ? (
                                    <button onClick={handleMentoringDoneClick} className="profileEditDone"><FontAwesomeIcon icon={faSquareCheck} /> Done</button>
                                ) : (
                                    <button onClick={handleMentoringEditClick} className="profileEditDone"><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                                )}
                            </div>
                            <p className="profileText">Mentoring on: </p>
                            <Select
                                isMulti
                                options={mentoringOn}
                                placeholder="Select the subjects you would like to mentor on"
                                className="profileMentorOn"
                                onChange={(selectedOptions) => {
                                    setSelectedMentorOn(selectedOptions);
                                }}
                                key={mentoringOn.map((option) => option.value).join(',')}
                                defaultValue={mentoringOn.filter((option) =>
                                    selectedMentorOn.some((selectedOption) => selectedOption.value === option.value)
                                )}
                                isDisabled={!mentoringIsEditing}
                            />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};