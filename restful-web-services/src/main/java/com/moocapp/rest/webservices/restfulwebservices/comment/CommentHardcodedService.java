package com.moocapp.rest.webservices.restfulwebservices.comment;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CommentHardcodedService {
	
	private static List<Comment> comments= new ArrayList<Comment>();
	private static int idCounter = 0;
	static {
		comments.add(new Comment(++idCounter, "comment description", "", idCounter-1, new Date(), "Instructor 1"));
		comments.add(new Comment(++idCounter, "comment description 2", "2", idCounter-1, new Date(), "Student 1"));
		comments.add(new Comment(++idCounter, "comment description 3", "3", idCounter-1, new Date(), "Student 1"));
	}
	
	public List<Comment> findAll(){
		return comments;
	}
	
	
	public Comment save(Comment comment) {
		if(comment.getId() == -1 || comment.getId()== 0) {
			comment.setId(++idCounter);
			comments.add(comment);
		}else {
			deleteById(comment.getId());
			comments.add(comment);
		}
		return comment;
	}
	
	public Comment deleteById(long id) {
		Comment comment = findById(id);
		if(comment==null) return null;
		
		if(comments.remove(comment)){
			return comment;
		}
		 
		return null;
	}

	public Comment findById(long id) {
		// TODO Auto-generated method stub
		
		for(Comment comment:comments) {
			if(comment.getId() == id) {
				return comment;
			}
		}
		return null;
	}
	
	
	
	
}
