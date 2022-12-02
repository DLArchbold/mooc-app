delete from comment;
delete from feedback;

insert into comment(id, description,urgency_level,in_response_to, target_date,username, votes)
values(1, 'description 1', '3', 0, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 1', 1);

insert into comment(id, description,urgency_level,in_response_to, target_date,username, votes)
values(2, 'description 2', '2', 1, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 2', 1);

insert into comment(id, description,urgency_level,in_response_to, target_date,username, votes)
values(3, 'description 3', '1', 2, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 3', 1);


insert into feedback(id, feedback_comment,feedback_rating, lesson_id)
values(1, 'feedback comment 1', 1, 1);

insert into feedback(id, feedback_comment,feedback_rating, lesson_id)
values(3, 'feedback comment 2', 2, 1);

insert into feedback(id, feedback_comment,feedback_rating, lesson_id)
values(2, 'feedback comment 3', 3, 1);

insert into feedback(id, feedback_comment,feedback_rating, lesson_id)
values(4, 'feedback comment 4', 3, 2);

insert into feedback(id, feedback_comment,feedback_rating, lesson_id)
values(5, 'feedback comment 5', 3, 2);



	