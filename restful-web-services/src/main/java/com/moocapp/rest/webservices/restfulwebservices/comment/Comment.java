package com.moocapp.rest.webservices.restfulwebservices.comment;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.boot.autoconfigure.domain.EntityScan;



@Entity
@EntityScan
public class Comment {
	
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@GenericGenerator(name="startfromlargestid" , strategy="increment")
	@GeneratedValue(generator="startfromlargestid")
	private long id;
	
	private String description;
	private String urgencyLevel;
	private long inResponseTo;
	private Date targetDate;
	private String username;

	
	protected Comment() {
		
	}
	
	public Comment(long id, String description, String urgencyLevel, long inResponseTo, Date targetDate, String username) {
		super();
		this.id = id;
		this.description = description;
		this.urgencyLevel = urgencyLevel;
		this.inResponseTo = inResponseTo;
		this.targetDate = targetDate;
		this.username = username;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public long getInResponseTo() {
		return inResponseTo;
	}

	public void setInResponseTo(long inResponseTo) {
		this.inResponseTo = inResponseTo;
	}

	public Date getTargetDate() {
		return targetDate;
	}

	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUrgencyLevel() {
		return urgencyLevel;
	}

	public void setUrgencyLevel(String urgencyLevel) {
		this.urgencyLevel = urgencyLevel;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Comment other = (Comment) obj;
		return id == other.id;
	}

	
	
}
