insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(1, 'description 1', 'High', 3, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'username 1');

insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(2, 'description 2', 'Medium', 2, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'username 2');

insert into comment(id, description,urgency_level,in_response_to, target_date,username)
values(3, 'description 3', 'Low', 1, LOCALTIMESTAMP - INTERVAL '30' MINUTE, 'username 3');



	