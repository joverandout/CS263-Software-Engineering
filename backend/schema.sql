DROP TABLE FEEDBACK CASCADE;
CREATE TABLE FEEDBACK (
		FeedbackID INTEGER PRIMARY KEY, 
		GeneralText VARCHAR(500), 
		Emotion VARCHAR(30), 
		FTime TIME, 
		Rating VARCHAR(15)
);

DROP TABLE HOSTS CASCADE;
CREATE TABLE HOSTS (
	HostID INTEGER PRIMARY KEY,
	Username VARCHAR(50), 
	FirstName VARCHAR(30),
	LastName VARCHAR(50),
	Password VARCHAR(30)
);


DROP TABLE TEMPLATES CASCADE;
CREATE TABLE TEMPLATES (
	TemplateID INTEGER PRIMARY KEY, 
	HostID INTEGER, 
	TemplateName VARCHAR(40),
	EmotionsSelected VARCHAR(100),
	Question VARCHAR(400),
	FOREIGN KEY (HostID) REFERENCES HOSTS(HostID) ON DELETE CASCADE
);

DROP TABLE MEETING CASCADE;
CREATE TABLE MEETING (
	MeetingID INTEGER PRIMARY KEY,
	HostID INTEGER, 
	TemplateID INTEGER, 
	MeetingName VARCHAR(30),
	Duration VARCHAR(30), 
	Category VARCHAR(30), 
	StartTime TIME, 
	FOREIGN KEY (HostID) REFERENCES HOSTS(HostID) ON DELETE CASCADE, 
	FOREIGN KEY (TemplateID) REFERENCES TEMPLATES(TemplateID) ON DELETE CASCADE
);

DROP TABLE ATTENDANCE CASCADE; 
CREATE TABLE ATTENDANCE (
	MeetingID INTEGER, 
	CompanyID INTEGER, 
	PRIMARY KEY(MeetingID, CompanyID),
	FOREIGN KEY (MeetingID) REFERENCES MEETING(MeetingID) ON DELETE CASCADE,
	FOREIGN KEY (CompanyID) REFERENCES ATTENDEE(CompanyID) ON DELETE CASCADE
);

DROP TABLE ATTENDEE CASCADE; 
CREATE TABLE ATTENDEE (
	CompanyID INTEGER PRIMARY KEY,
	Username VARCHAR(50)
);

DROP TABLE USERFEEDBACK CASCADE;
CREATE TABLE USERFEEDBACK (
	FeedbackID INTEGER PRIMARY KEY, 
	MeetingID INTEGER, 
	CompanyID INTEGER, 
	FOREIGN KEY (MeetingID) REFERENCES MEETING(MeetingID) ON DELETE CASCADE,
	FOREIGN KEY (CompanyID) REFERENCES ATTENDEE(CompanyID) ON DELETE CASCADE,
	FOREIGN KEY (FeedbackID) REFERENCES FEEDBACK(FeedbackID) ON DELETE CASCADE
);

