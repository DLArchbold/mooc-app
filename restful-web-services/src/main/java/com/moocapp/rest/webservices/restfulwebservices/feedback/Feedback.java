package com.moocapp.rest.webservices.restfulwebservices.feedback;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@Entity
@EntityScan
public class Feedback {

//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@GenericGenerator(name = "startfromlargestid", strategy = "increment")
	@GeneratedValue(generator = "startfromlargestid")
	private long id;

	@Lob
	@Column(length=100000)
	private String feedbackComment;
	
	private long feedbackRating;

	private long lessonId;
public Feedback() {
	
}
	public Feedback(long id, String feedbackComment, long feedbackRating, long lessonId) {
		super();
		this.id = id;
		this.feedbackComment = feedbackComment;
		this.feedbackRating = feedbackRating;
		this.lessonId = lessonId;
	}

	/**
	 * @return the id
	 */
	public long getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(long id) {
		this.id = id;
	}

	/**
	 * @return the feedbackComment
	 */
	public String getFeedbackComment() {
		return feedbackComment;
	}

	/**
	 * @param feedbackComment the feedbackComment to set
	 */
	public void setFeedbackComment(String feedbackComment) {
		this.feedbackComment = feedbackComment;
	}

	/**
	 * @return the feedbackRating
	 */
	public long getFeedbackRating() {
		return feedbackRating;
	}

	/**
	 * @param feedbackRating the feedbackRating to set
	 */
	public void setFeedbackRating(long feedbackRating) {
		this.feedbackRating = feedbackRating;
	}

	/**
	 * @return the lessonId
	 */
	public long getLessonId() {
		return lessonId;
	}

	/**
	 * @param lessonId the lessonId to set
	 */
	public void setLessonId(long lessonId) {
		this.lessonId = lessonId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(feedbackComment, feedbackRating, id, lessonId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Feedback other = (Feedback) obj;
		return Objects.equals(feedbackComment, other.feedbackComment) && feedbackRating == other.feedbackRating
				&& id == other.id && lessonId == other.lessonId;
	}
	
	


}
