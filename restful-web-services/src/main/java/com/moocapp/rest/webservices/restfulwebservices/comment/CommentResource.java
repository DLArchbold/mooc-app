package com.moocapp.rest.webservices.restfulwebservices.comment;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.moocapp.rest.webservices.restfulwebservices.comment.service.CommentRepository;




@RestController
@CrossOrigin
public class CommentResource     {

	@Autowired 
	private CommentRepository commentRepository;
	
	@GetMapping("/users/{username}/comments")
	public List<Comment> getAllComments(@PathVariable String username){
//		return commentRepository.findByUsername(username);
		return commentRepository.findAll();
	}
	
	@GetMapping("/users/{username}/comments/{id}")
	public Comment getComment(@PathVariable String username, @PathVariable long id){
		return  commentRepository.findById(id).get();
	}
	
	
	//DELETE /users/{username}/todos/{id}
	@DeleteMapping("/users/{username}/comments/{id}")
	public ResponseEntity<Void> deleteComment(
			@PathVariable String username, @PathVariable long id){
		
//		Comment comment = commentService.deleteById(id);
//		if(comment!=null) {
//			return ResponseEntity.noContent().build();
//		}
		commentRepository.deleteById(id);
		
		return ResponseEntity.noContent().build();
	}
	
	
	@PutMapping("/users/{username}/comments/{id}")
	public ResponseEntity<Comment> updateComment(
			@PathVariable String username, 
			@PathVariable long id, @RequestBody Comment comment){
//		Comment commentUpdated = commentService.save(comment);
		
		
		comment.setUsername(username);
		
		Comment commentUpdated = commentRepository.save(comment);
		return new ResponseEntity<Comment>(comment, HttpStatus.OK);
		
	}
	
	
	@PostMapping("/users/{username}/comments")
	public ResponseEntity<Comment> createComment(
			@PathVariable String username, @RequestBody Comment comment){
		
//		comment.setUsername(username);
//		Comment createdComment = commentService.save(comment);
		
		
//		comment.setId(-1L);
		
		
//		String a =  comment.getDescription().replaceAll("/'/g", "''");
//		System.out.println("replace: " + a);
		
		Comment createdComment= commentRepository.save(comment);
		
		
		//Location
		//Get current resouce url
		//{id}
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
			.path("/{id}").buildAndExpand(createdComment.getId()).toUri();
		
		
		return ResponseEntity.created(uri).build();
		
	}
	
	
}


//@RestController
////@CrossOrigin(origins="http://localhost:4200")
//@CrossOrigin
//public class CommentResource {
//
//	@Autowired 
//	private CommentHardcodedService commentService;
//	
//	@GetMapping("/users/{username}/comments")
//	public List<Comment> getAllComments(@PathVariable String username){
//		return commentService.findAll();
//	}
//	
//	@GetMapping("/users/{username}/comments/{id}")
//	public Comment getComment(@PathVariable String username, @PathVariable long id){
//		return commentService.findById(id);
//	}
//	
//	
//	//DELETE /users/{username}/todos/{id}
//	@DeleteMapping("/users/{username}/comments/{id}")
//	public ResponseEntity<Void> deleteComment(
//			@PathVariable String username, @PathVariable long id){
//		
//		Comment comment = commentService.deleteById(id);
//		if(comment!=null) {
//			return ResponseEntity.noContent().build();
//		}
//		
//		return ResponseEntity.notFound().build();
//	}
//	
//	
//	@PutMapping("/users/{username}/comments/{id}")
//	public ResponseEntity<Comment> updateComment(
//			@PathVariable String username, 
//			@PathVariable long id, @RequestBody Comment comment){
//		Comment commentUpdated = commentService.save(comment);
//		
//		return new ResponseEntity<Comment>(comment, HttpStatus.OK);
//		
//	}
//	
//	
//	@PostMapping("/users/{username}/comments")
//	public ResponseEntity<Comment> createComment(
//			@PathVariable String username, @RequestBody Comment comment){
//		
//		comment.setUsername(username);
//		Comment createdComment = commentService.save(comment);
//		
//		//Location
//		//Get current resouce url
//		//{id}
//		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
//			.path("/{id}").buildAndExpand(createdComment.getId()).toUri();
//		
//		
//		return ResponseEntity.created(uri).build();
//		
//	}
//	
//	
//}
