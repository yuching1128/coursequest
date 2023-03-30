create schema CourseQuest;
use CourseQuest;

create table degree
(
    id   int auto_increment
        primary key,
    name varchar(255) null
);

create table instructor
(
    id   int auto_increment
        primary key,
    name varchar(255) null
);

create table major
(
    id   int auto_increment
        primary key,
    name varchar(255) null
);

create table university
(
    id            int auto_increment
        primary key,
    name          varchar(255) null,
    university_id int          null,
    constraint FK1gjitje5viflnb2bkdin1so2m
        foreign key (university_id) references university (id)
);

create table course
(
    id            int auto_increment
        primary key,
    description   varchar(255) null,
    name          varchar(255) null,
    rating        float        null,
    degree_id     int          null,
    university_id int          null,
    instructor_id int          null,
    constraint FK4ag2rc4adjiesa1d0lcvnnq82
        foreign key (university_id) references university (id),
    constraint FKdgomx5qg5fvg9cgyh0sdh0vwo
        foreign key (degree_id) references degree (id),
    constraint FKqk2yq2yk124dhlsilomy36qr9
        foreign key (instructor_id) references instructor (id)
);

create table coursecrn
(
    id            int auto_increment
        primary key,
    crn_number    varchar(255) null,
    coursecrns_id int          null,
    constraint FK8ye05xkt7k1f6j29lrawh699g
        foreign key (coursecrns_id) references course (id)
);

create table department
(
    id            int auto_increment
        primary key,
    name          varchar(255) null,
    university_id int          null,
    constraint FKh2ap9lv99txektaou64wpx8b2
        foreign key (university_id) references university (id)
);

create table level
(
    id            int auto_increment
        primary key,
    name          varchar(255) null,
    university_id int          null,
    constraint FKkvg8900rbtqtvud24vcsnw6rw
        foreign key (university_id) references university (id)
);

create table user
(
    id            int auto_increment
        primary key,
    first_name    varchar(255) null,
    last_name     varchar(255) null,
    password      varchar(255) null,
    phone         varchar(255) null,
    concentration varchar(255) null,
    major         varchar(255) null,
    email         varchar(255) null,
    degree_id     int          null,
    university_id int          null,
    major_id      int          null,
    constraint FKc1q9juawhjvqie7wi3p44me9y
        foreign key (major_id) references major (id),
    constraint FKfgcbu6cj5oqlmnrocb7ctc7wl
        foreign key (degree_id) references degree (id),
    constraint FKic5iffsyggke974jb0jbdb0m
        foreign key (university_id) references university (id)
);

create table review
(
    id            int auto_increment
        primary key,
    content       varchar(255) null,
    created_at    datetime(6)  not null,
    delivery      int          null,
    is_anonymous  bit          null,
    rating        float        null,
    workload      int          null,
    course_id     int          null,
    instructor_id int          null,
    university_id int          null,
    user_id       int          null,
    constraint FKd3gy0ma4syq3tkgqyje0nbhb2
        foreign key (instructor_id) references instructor (id),
    constraint FKiyf57dy48lyiftdrf7y87rnxi
        foreign key (user_id) references user (id),
    constraint FKn3q1vv5fmlyv3ouelg9ta0unb
        foreign key (university_id) references university (id),
    constraint FKprox8elgnr8u5wrq1983degk
        foreign key (course_id) references course (id)
);




-- Degrees Data
INSERT INTO CourseQuest.degree (name) VALUES ('bachelor');
INSERT INTO CourseQuest.degree (name) VALUES ('master');
INSERT INTO CourseQuest.degree (name) VALUES ('doctor');

-- Universities Data
INSERT INTO CourseQuest.university (name) VALUES ('Virginia Tech');
INSERT INTO CourseQuest.university (name) VALUES ('New York University');
INSERT INTO CourseQuest.university (name) VALUES ('Stanford University');
INSERT INTO CourseQuest.university (name) VALUES ('Columbia University');

-- Courses Data
INSERT INTO CourseQuest.course (crn_number, description, name, rating, degree_id, university_id) VALUES ('CRN10001', 'This course teaches you about the power of the Software Development Lifecycle (SDLC) and software development methodologies like Agile. Explore fundamental programming principles and foundations of design, architecture, and deployment. Investigate skills a software engineer needs and identify job opportunities with hands-on projects. You will also learn about programming basics and software development tools and stacks. ', 'Software Engineering', 3.8, 1, 1);
INSERT INTO CourseQuest.course (crn_number, description, name, rating, degree_id, university_id) VALUES ('CRN10002', 'In computer science, a data structure is a way of organizing and storing data in a computer program so that it can be accessed and used efficiently. Data structures provide a means of managing large amounts of data, enabling efficient searching, sorting, insertion, and deletion of data.', 'Data Structure', 4.1, 2, 1);
INSERT INTO CourseQuest.course (crn_number, description, name, rating, degree_id, university_id) VALUES ('CRN10003', 'At 65+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery.', 'Web Development', 4.2, 3, 1);

-- Instructors Data
insert into CourseQuest.instructor (id, name) values (1, 'Dr. M');
insert into CourseQuest.instructor (id, name) values (2, 'Dr. K');
insert into CourseQuest.instructor (id, name) values (3, 'Dr. A');

-- User Data
insert into CourseQuest.user (id, first_name, last_name, password, phone) values (1, 'Eugene', 'Feng', 'sdfgsdfg', '8623579779');
insert into CourseQuest.user  (id, first_name, last_name, password, phone) values (2, 'Flora', 'Lin', 'sfgsdfg', '15151973561');
insert into CourseQuest.user  (id, first_name, last_name, password, phone) values (3, 'Jack', 'Lu', 'sdfg', '123');
insert into CourseQuest.user  (id, first_name, last_name, password, phone) values (4, 'Jake', 'Ma', 'sfg', '2323');

-- Reviews Data
insert into CourseQuest.review (id, content, created_at, delivery, is_anonymous, rating, workload, course_id, instructor_id, university_id, user_id) values (1, 'Good Course', '2023-03-23 08:04:28', 0, true, 4.1, 1, 1, 1, 1, 1);
insert into CourseQuest.review (id, content, created_at, delivery, is_anonymous, rating, workload, course_id, instructor_id, university_id, user_id) values (2, 'Nice Course', '2023-03-23 08:04:31', 1, true, 4.2, 0, 2, 2, 1, 1);
insert into CourseQuest.review (id, content, created_at, delivery, is_anonymous, rating, workload, course_id, instructor_id, university_id, user_id) values (3, 'Bad Course', '2023-03-23 08:04:32', 0, true, 4.4, 1, 1, 1, 1, 2);
insert into CourseQuest.review (id, content, created_at, delivery, is_anonymous, rating, workload, course_id, instructor_id, university_id, user_id) values (4, 'Bad Bad', '2023-03-23 08:04:33', 0, false, 5, 1, 1, 1, 1, 3);

  
INSERT INTO `CourseQuest`.`department` (`id`, `university_id`, `name`) VALUES ('1', '1', 'CS');

INSERT INTO `CourseQuest`.`department` (`id`, `university_id`, `name`) VALUES ('2', '1', 'CE');
INSERT INTO `CourseQuest`.`department` (`id`, `university_id`, `name`) VALUES ('3', '1', 'Civil');

INSERT INTO `CourseQuest`.`level` (`id`, `university_id`, `name`) VALUES ('1', '1', 'UG');

INSERT INTO `CourseQuest`.`level` (`id`, `university_id`, `name`) VALUES ('2', '1', 'Master');
INSERT INTO `CourseQuest`.`level` (`id`, `university_id`, `name`) VALUES ('3', '1', 'Phd');

INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN1001', 1);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN1001', 1);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN2001', 2);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN2001', 2);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN3001', 3);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN3001', 3);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN4001', 4);
INSERT INTO CourseQuest.coursecrn (crn_number, coursecrns_id) VALUES ('CRN4002', 4);
