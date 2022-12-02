package com.moocapp.rest.webservices.restfulwebservices.feedback;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.moocapp.rest.webservices.restfulwebservices.comment.Comment;


@Repository
//Allows us to perform operations (add, delete, update) on Comment entity
public interface FeedbackRepository extends JpaRepository<Feedback, Long>{
//	List<Comment> findByUsername(String username);
	
	//service.retrieveTodos(name)

	//service.deleteTodo(id);
	//service.retrieveTodo(id)
	//service.updateTodo(todo)
	//service.addTodo(getLoggedInUserName(model), todo.getDesc(), todo.getTargetDate(),false);
}
