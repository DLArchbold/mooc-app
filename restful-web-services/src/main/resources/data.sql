delete from comment;

insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(1, 'description 1', '3', 0, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 1');

insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(2, 'description 2', '2', 1, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 2');

insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(3, 'description 3', '1', 2, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'Student 3');



	