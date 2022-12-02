package com.moocapp.rest.webservices.restfulwebservices.feedback;

import java.net.URI;
import java.util.ArrayList;
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
public class FeedbackResource {

	@Autowired
	private FeedbackRepository feedbackRepository;

	@GetMapping("/feedback")
	public List<Feedback> getAllFeedback() {
		// if there's a @PathVariable long lessonId in method parameter
		// Then it must be part of URI variable also like {lessonId}/feedback
		// else will have error
//		return commentRepository.findByUsername(username);
		return feedbackRepository.findAll();
	}

	@GetMapping("/{lessonId}/feedback")
	public List<Feedback> getFeebackForALesson(@PathVariable long lessonId) {
//		return  feedbackRepository.findById(id).get();

		List<Long> tempList = new ArrayList<Long>();
		tempList.add(lessonId);
		List<Feedback> temp = new ArrayList<Feedback>();
		temp = feedbackRepository.findAll();
		List<Feedback> toReturn = new ArrayList<Feedback>();
		for (Feedback f:temp) {
			if (f.getLessonId() == lessonId) {
				toReturn.add(f);
			}
		}
		return toReturn;
//		feedbackRepository.findby
//		feedbackRepository.find
//		return feedbackRepository.findAllById(tempList);
	}

	// DELETE /users/{username}/todos/{id}
	@DeleteMapping("/{lessonId}/feedback/{feedbackId}")
	public ResponseEntity<Void> deleteFeedback(@PathVariable long lessonId, @PathVariable long feedbackId) {

//		Comment comment = commentService.deleteById(id);
//		if(comment!=null) {
//			return ResponseEntity.noContent().build();
//		}
		feedbackRepository.deleteById(feedbackId);

		return ResponseEntity.noContent().build();
	}

//	
//	@PutMapping("/users/{username}/comments/{id}")
//	public ResponseEntity<Comment> updateComment(
//			@PathVariable String username, 
//			@PathVariable long id, @RequestBody Comment comment){
////		Comment commentUpdated = commentService.save(comment);
//		
//		
//		comment.setUsername(username);
//		
//		Comment commentUpdated = commentRepository.save(comment);
//		return new ResponseEntity<Comment>(comment, HttpStatus.OK);
//		
//	}

	@PostMapping("/{lessonId}/feedback")
	public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {

//		comment.setUsername(username);
//		Comment createdComment = commentService.save(comment);

//		comment.setId(-1L);

//		String a =  comment.getDescription().replaceAll("/'/g", "''");
//		System.out.println("replace: " + a);

		Feedback createdFeedback = feedbackRepository.save(feedback);

		// Location
		// Get current resouce url
		// {id}
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(createdFeedback.getId())
				.toUri();

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
