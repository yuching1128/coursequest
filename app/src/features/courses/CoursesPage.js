import React from 'react'
import {Link, useParams} from "react-router-dom";
import Container from "react-bootstrap/Container";
import {Spinner} from "react-bootstrap";
import {useGetCoursesQuery} from "../api/apiSlice";
import {useSelector} from "react-redux";

let CourseExcerpt = ({ course }) => {
    return (
        <article className="course-excerpt" key={course.id}>
            <Link to={`/courses/${course.id}`} className="button">
                <h3>{course.name}</h3>
            </Link>
            <p>Professor: {course.instructor}</p>
            <p className="description">{course.description.substring(0, 100)}...</p>
            <div>Rating: {course.rating} / 5</div>
            <hr />
        </article>
    )
}

export const CoursesPage = () => {

    const { universityId } = useParams()

    const {
        data: courses,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCoursesQuery(universityId)

    let content

    if (isLoading) {
        content = <Spinner text="Loading..." />
    } else if (isSuccess) {
        content = courses.map(course => <CourseExcerpt key={course.id} course={course} />)
    } else if (isError) {
        content = <div>{error.toString()}</div>
    }

    return (
        <Container className="courses-list">
            <h2>Courses:</h2>
            {content}
        </Container>
    )



}


