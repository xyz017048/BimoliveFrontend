
Base URL:
	http://bimolive.us-west-2.elasticbeanstalk.com/

All request and responses are in JSON.

*********************************   Sign up/Sign in     ******************************
Sign up - Check Username:
	Request: POST   /usernameCheck
			{
				"username":     STRING
			}
	Response:
			{
				"result":       INT   (result=0 invalid; reuslt=1 valid)
			}

Sign up - Check Email Address: 
	Request: POST    /emailCheck
			{
				"email":        STRING
			}
	Response:
			{
				"result":       INT 	(result=0 invalid; reuslt=1 valid)
			}


Registration:
	Request: POST  /register
			{
				"email":		STRING,
				"username":		STRING,
				"password":             STRING
			}

	Response:
			{
				"result": 		INT,  (result = 1)
				"idUser": 		INT,
				"email":  		STRING,
				"username":             STRING,
				"roleLevel":            INT,   (1:student; 2:teacher)
				"firstName":            STRING,
				"lastName":		STRING,
				"lastLogin":            STRING,
				"profile": 		STRING,
				"introWords":           STRING,
				"regisDate":            STRING,
                                "resume":               STRING,
                                "company":              STRING,
                                "jobTitle":             STRING
			}

Login:  (teacher: teacher@gmail.com, teacher;  student: student@gmail.com,  student)
	Request: POST   /login
			{
				"email":                STRING,
				"password":             STRING
			} 

	Response (Not valid user):
			{
				"result":               INT  (result = 0)
			}
	Response (valid user):
			{
				"result": 		INT,  (result = 1)
				"idUser": 		INT,
				"email":  		STRING,
				"username":             STRING,
				"roleLevel":            INT,   (1:student; 2:teacher)
				"firstName":            STRING,
				"lastName":		STRING,
				"lastLogin":            STRING,
                                "profile": 		STRING,
				"introWords":           STRING,
                                "regisDate":            STRING,
                                "resume":               STRING,
                                "company":              STRING,
                                "jobTitle":             STRING,
                                "applyStatus":          STRING   (note: 'applyStatus' == "new"/"read" means the user is waiting for approval)
			}

Teacher generate a key:
                Request: POST   /teacher/generatekey
                                {
                                    "idUser":           INT
                                }
                Response:
                                {
                                    "keyString":        STRING
                                }


*********************************   Question send/get/answer/delete/ban    **********************
Question ask and answer Part:
	For student view to send a question:
		Request: POST /student/sendquestion
				{
					"idUser":	INT,
					"username" :   	STRING,
					"idLecture":	INT,
				 	"content" : 	STRING
				}
		Response:
				{
					"result": INT 	(result=0 fail; reuslt=1 success)
				}

        For Student question panel to display answered and solved question and 
        For teacher to get all questions::
                Request: POST   /getquestions
                                {
                                    "roleLevel":        INT, (1:student; 2:teacher)
                                    "idLecture":        INT,
                                    "idQuestion":       INT (if idQuestion == -1, get all questions with 'answer/ban/flag' status for student or 'new/read/answer/flag/ban' status for teacher
												from this lecture;
										else, get questions after this idQuestion)
                                }
                Response:   it is possible to receive empty response.
                        note: for teacher, the questions are order by sendTime
                              for student, the questions are order by changeTime, which means the answering time.
                                [
                                    {
                                        "lectureStatus":    STRING,  (live,replay,finish)
                                        "idQuestion":       INT,
                                        "username":         STRING,
                                        "content" :         STRING,
                                        "status":           STRING,
                                        "sendTime":         STRING, (format: yyyy-MM-dd hh:mm:ss)
                                        "changeTime":       STRING (format: yyyy-MM-dd hh:mm:ss) if status is still 'new', the changeTime will be same as sendTime
                                    },
                                    ...
                                ]
                                
        Teacher makes an action on a question: 
                Request: POST   /teacher/questionaction
                                {
                                    "idQuestion":       INT,
                                    "status":           STRING (can be "read","delete","answer", "ban")
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }        


**************************  Teacher create/get/update course(s)/lecture(s)  ************************
Teacher create/update/get [single course/ all courses/ single lecture/all lectures]:
        Get course category: 
                Request: POST/GET  /getcategory
                Response:
                                [
                                    {
                                        "abbreviation": STRING,
                                        "fullName":     STRING
                                    },
                                    ...
                                ]
                                    
        Get All my Courses:  
                Request: POST   /teacher/courses
                                {
                                    "idUser":           INT
                                }

                Response：      may be an empty list, order by "createDate" desc
                                [
                                    {
                                        "idCourse":         INT,
                                        "idUser":           INT,
                                        "category":         STRING,
                                        "levelNumber":      INT,
                                        "name":             STRING,
                                        "intro":            STRING,
                                        "image":            STRING,     (the image path/id of the course)
                                        "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                        "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                        "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                        "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                        endFlag = 1, real endDate)
                                        "permissionCode":   STRING
                                    },
                                    ...
                                ]


        Get a single course:
                Request: POST   /teacher/singlecourse
                                {
                                    "idCourse":           INT,
                                    "idUser":             INT
                                }

                Response：      
                                {
                                    "idCourse":         INT,
                                    "idUser":           INT,
                                    "category":         STRING,
                                    "levelNumber":      INT,
                                    "name":             STRING,
                                    "intro":            STRING,
                                    "image":            STRING,     (the image path/id of the course)
                                    "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                        endFlag = 1, real endDate)
                                    "permissionCode":   STRING
                                }
                                

        Create a course:
                Request: POST   /teacher/createcourse
                                {
                                    "idUser":           INT,
                                    "category":         STRING,
                                    "levelNumber":      INT,
                                    "name":             STRING,
                                    "intro":            STRING,
                                    "image":            STRING,     (the image path/id of the course)
                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                    endFlag = 1, real endDate)
                                    "permissionCode":   STRING
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }


        Teacher update a course:
                Request: POST   /teacher/updatecourse
                                {
                                    "idCourse":         INT,
                                    "category":         STRING,
                                    "levelNumber":      INT,
                                    "name":             STRING,
                                    "intro":            STRING,
                                    "image":            STRING,     (the image path/id of the course)
                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                    endFlag = 1, real endDate)
                                    "permissionCode":   STRING
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }


        Get all lectures of one course: when you click on one course, you will request all lectures of this course.
                Request:    POST    /teacher/lectures
                                {
                                    "idCourse":         INT
                                }
                                  
                Response:   may be an empty list, order by "lectureNum"
                                [
                                    {
                                        "idLecture":        INT,
                                        "idCourse":         INT,
                                        "lectureNum":       INT,       
                                        "topic":            STRING,
                                        "intro":            STRING,     (may not be required)
                                        "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                        "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                        "startTime":        STRING,     (format: "hh:mm")
                                        "endTime":          STRING,     (format: "hh:mm")
                                        "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                        "status":           STRING,         
                                        "url":              STRING
                                    },
                                    ...
                                ]

        Get a single Lecture: a lecture can has status = "wait"/"live"/"finish"/"replay"
                Request:    POST    /teacher/singlelecture
                                {
                                    "idUser":           INT,
                                    "idLecture":         INT,
                                }                                 
                Response:   
                                {
                                    "courseName":           STRING,
                                    "lectureInfo":          {
                                                                "idLecture":        INT,
                                                                "idCourse":         INT,
                                                                "lectureNum":       INT,       
                                                                "topic":            STRING,
                                                                "intro":            STRING,     (may not be required)
                                                                "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                                                "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                                                "startTime":        STRING,     (format: "hh:mm")
                                                                "endTime":          STRING,     (format: "hh:mm")
                                                                "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                "status":           STRING,         
                                                                "url":              STRING
                                                            }
                                }


        Create a new Lecture:   
                Request: POST   /teacher/createlecture
                                {
                                    "idCourse":         INT,
                                    "lectureNum":       INT,       (will only display the correct number for teacher)
                                    "topic":            STRING,
                                    "intro":            STRING,     (may not be required)
                                    "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                    "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                    "startTime":        STRING,     (format: "hh:mm")
                                    "endTime":          STRING      (format: "hh:mm")
                                }
                Response:
                                {
                                    "result":           INT     //actually the idLecture, if -1 indicates "create" successfully, but DB happens something ban when getting id.
                                                                                          if 0, indicates "create" unsuccessfully.
                                }


        Teacher update a lecture:
                Request: POST   /teacher/updatelecture
                                {
                                    "idLecture":        INT,
                                    "topic":            STRING,
                                    "intro":            STRING,     (may not be required)
                                    "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                    "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                    "startTime":        STRING,     (format: "hh:mm")
                                    "endTime":          STRING      (format: "hh:mm")
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }

Teacher start a lecture:
            Request: POST   /teacher/startlecture
                            {
                                "idUser":       INT,
                                "idLecture":    INT
                            }
            Response:   May receive 403 error, if the teacher don't hold this lecture.
                            {
                                "result":       INT     (result=0 fail; reuslt=1 success)
                            }

Teacher ends a live lecture:
            Request: POST   /teacher/endlecture
                            {
                                "idUser":       INT,
                                "idLecture":    INT
                            }
            Response:   May receive 403 error, if the teacher don't hold this lecture
                            or this lecture is not live.
                            {
                                "result":       INT     (result=0 fail; reuslt=1 success)
                            }

Teacher uploads a lecture video to replay
            Request: POST   /teacher/uploadlecture
                            {
                                "idUser":       INT,
                                "idLecture":    INT,
                                "url":          STRING,
                                "image":        STRING
                            }
            Response:   May receive 403 error, if the teacher don't hold this lecture
                            or this lecture is not live.
                            {
                                "result":       INT     (result=0 fail; reuslt=1 success)
                            }

Teacher upload a video: (change status = "replay", url = where in amazon cloud)


*************************** Student get all live/replay videos  ***************************
Get all live videos:
            Request: GET/POST   /livevideos
            ResPonse:       
                        [
                            {
                                "teacherFirstName":     STRING,
                                "teacherLastName":      STRING,
                                "courseName"            STRING,
                                "lectureNum":           INT, 
                                "idLecture":            INT,
                                "topic":                STRING,
                                "intro":                STRING,     (may be empty)
                                "image":                STRING,     (the image path/id of the lecture, may need a default pic)
                                "url":                  STRING      (this is actually the key)
                            },
                            ...
                            ...
                        ]


Get all replay videos:
            Request: GET/POST   /replayvideos
            ResPonse:       
                        [
                            {
                                "teacherFirstName":     STRING,
                                "teacherLastName":      STRING,
                                "courseName"            STRING,
                                "lectureNum":           INT, 
                                "idLecture":            INT,
                                "topic":                STRING,
                                "intro":                STRING,     (may be empty)
                                "image":                STRING,     (the image path/id of the lecture, may need a default pic)
                                "url":                  STRING      (this is the url on amazon cloud)
                            },
                            ...
                            ...
                        ]

************************    Student get course/lecture/teacher info ***************************

Student Get a single Lecture:         NOTE: if 'status' == 'wait', student can only see the info of this lecture. display scheduled time.
                                            if 'status' == 'live', display detail info, has a button says 'view', then show the live video to the student, and can send a question if login
                                            if 'status' == 'replay', display detail info, the button says 'replay',then show the video to the student, all answered questions should display in the question panel,
                                                                      and disable sending question channel.
                                            if 'status' == 'finish', display detail info, imply this is not available right now.
                
                Request:    POST    /student/singlelecture
                                {
                                    "idUser":           INT,
                                    "idLecture":        INT
                                }                                 
                Response:   
                                {
                                    "teacherFirstName":     STRING,
                                    "teacherLastName":      STRING,
                                    "courseName":           STRING,
                                    "idTeacher":            INT,
                                    "lectureInfo":          {
                                                                "idLecture":        INT,
                                                                "idCourse":         INT,
                                                                "lectureNum":       INT,       
                                                                "topic":            STRING,
                                                                "intro":            STRING,     (may not be required)
                                                                "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                                                "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                                                "startTime":        STRING,     (format: "hh:mm")
                                                                "endTime":          STRING,     (format: "hh:mm")
                                                                "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                "status":           STRING,         
                                                                "url":              STRING
                                                            },
                                    "followCourse":         INT (0/1),
                                    "followTeacher":        INT (0/1),
                                    "permitStatus":         INT (0/1)
                                }

Student Get a single course:
                Request: POST   /student/singlecourse
                                {
                                    "idCourse":           INT,
                                    "idUser":             INT
                                }

                Response：      receive 403 means there is no such course.
                                {
                                    "teacherFirstName":     STRING,
                                    "teacherLastName":      STRING,
                                    "courseInfo":           {
                                                                "idCourse":         INT,
                                                                "idUser":           INT,        (teacher id)
                                                                "category":         STRING,
                                                                "levelNumber":      INT,
                                                                "name":             STRING,
                                                                "intro":            STRING,
                                                                "image":            STRING,     (the image path/id of the course)
                                                                "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                                                "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                                                "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                                                    endFlag = 1, real endDate)
                                                            },
                                    "followCourse":         INT (0/1)
                                }
                                
Student get all my followed courses:
                Request:    POST    /student/followedcourses
                                {
                                    "idUser":           INT
                                }
                              
                Response:   
                                [
                                    {
                                        "teacherFirstName":     STRING,
                                        "teacherLastName":      STRING,
                                        "courseInfo":           {
                                                                    "idCourse":         INT,
                                                                    "idUser":           INT,        (teacher id)
                                                                    "category":         STRING,
                                                                    "levelNumber":      INT,
                                                                    "name":             STRING,
                                                                    "intro":            STRING,
                                                                    "image":            STRING,     (the image path/id of the course)
                                                                    "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                                                        endFlag = 1, real endDate)
                                                                },
                                        "followCourse":         INT (0/1)
                                    },
                                    ...
                                    ...
                                ]


Student get all my followed teachers:
                Request:    POST    /student/followedteachers
                                {
                                    "idUser":           INT
                                }
                                
                Response:   
                                [
                                    {   
                                        "idUser":               INT,
                                        "email":  		STRING,    
                                        "username":             STRING,   
                                        "firstName":            STRING,
                                        "lastName":		STRING,
                                        "profile": 		STRING,  
                                        "introWords":           STRING,
                                        "resume":               STRING, 
                                        "company":              STRING, 
                                        "jobTitle":             STRING 
                                    }
                                    ...
                                    ...
                                ]

Student get a teacher info:
                Request:    POST    /student/teacherinfo
                                {
                                    "idUser":              INT,
                                    "idTeacher":           INT
                                }
                                
                Response:    403 if teacher does not exist.
                                {
                                    "teacherInfo":      {   
                                                            "idUser":               INT,
                                                            "email":                STRING,    
                                                            "username":             STRING,   
                                                            "firstName":            STRING,
                                                            "lastName":             STRING,
                                                            "profile":              STRING,  
                                                            "introWords":           STRING,
                                                            "resume":               STRING, 
                                                            "company":              STRING, 
                                                            "jobTitle":             STRING 
                                                        },
                                    "followTeacher":    INT (0/1)
                                }
                            
Student get all courses:
                Request:    POST    /student/courses
                                {
                                    "idUser":           INT
                                }
                              
                Response:   
                                [
                                    {
                                        "teacherFirstName":     STRING,
                                        "teacherLastName":      STRING,
                                        "courseInfo":           {
                                                                    "idCourse":         INT,
                                                                    "idUser":           INT,        (teacher id)
                                                                    "category":         STRING,
                                                                    "levelNumber":      INT,
                                                                    "name":             STRING,
                                                                    "intro":            STRING,
                                                                    "image":            STRING,     (the image path/id of the course)
                                                                    "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                                                        endFlag = 1, real endDate)
                                                                }
                                    },
                                    ...
                                    ...
                                ]


In replay mode, get all answered questions:

**********************************Student follow/unfollow course/teacher *********************************
Student follow a course:    if the course has already been followed, make the icon to be "unfollow".
 
                Request:    POST   /student/followcourse
                                {
                                    "idUser":       INT,
                                    "idCourse":     INT,  //  follow at course page, idCourse is valid, make "idLecture = -1"
                                    "idLecure":     INT   //  follow at lecture page, idLecture is valid, make "idCourse = -1"
                                                           // if both idCourse and idLecture are not -1, consider idCourse first
                                }

                Response:   
                                {
                                    "result":       INT     (result=0 fail; reuslt=1 success)
                                }


Student follow a teacher:   make the icon to be "unfollow" when student has already followed the teacher.
 
                Request:    POST   /student/followteacher
                                {
                                    "idUser":       INT,
                                    "idCourse":     INT,  //  follow at course page, idCourse is valid, make "idLecture & idTeacher = -1"
                                    "idLecure":     INT,  //  follow at lecture page, idLecture is valid, make "idCourse & idTeacher = -1"
                                    "idTeacher":    INT    // follow at teahcer info page, idTeacher is valid, make "idCourse & idLecture = -1"
                                                            // priority idTeacher > idCourse > idLecture
                                }

                Response:   
                                {
                                    "result":       INT     (result=0 fail; reuslt=1 success)
                                }
  
Student unfollow a course:
 
                Request:    POST   /student/unfollowcourse
                                {
                                    "idUser":       INT,
                                    "idCourse":     INT,  //  unfollow at course page, idCourse is valid, make "idLecture = -1"
                                    "idLecure":     INT   //  unfollow at lecture page, idLecture is valid, make "idCourse = -1"
                                                           // if both idCourse and idLecture are not -1, consider idCourse first
                                }

                Response:   
                                {
                                    "result":       INT     (result=0 fail; reuslt=1 success)
                                }


Student unfollow a teacher:
 
                Request:    POST   /student/unfollowteacher
                                {
                                    "idUser":       INT,
                                    "idCourse":     INT,  //  unfollow at course page, idCourse is valid, make "idLecture & idTeacher = -1"
                                    "idLecure":     INT,  //  unfollow at lecture page, idLecture is valid, make "idCourse & idTeacher = -1"
                                    "idTeacher":    INT    // unfollow at teahcer info page, idTeacher is valid, make "idCourse & idLecture = -1"
                                                            // priority idTeacher > idCourse > idLecture
                                }

                Response:   
                                {
                                    "result":       INT     (result=0 fail; reuslt=1 success)
                                }


*********************************   Apply to be a teacher   **********************************
Apply to be a teacher
                Request: POST   /teacherapply
                                {
                                        "idUser": 		INT,
                                        "firstName":            STRING,
                                        "lastName":		STRING,
                                        "profile": 		STRING,  (require upload the applicant's formal picture)
                                        "introWords":           STRING,
                                        "resume":               STRING, 
                                        "company":              STRING, 
                                        "jobTitle":             STRING
                                } 

                Response:  User may not exits, receive 403 error
                                {
                                        "result":               INT  (0/1)
                                }


********************************  Account update  ***************************
User Account update:
                Request: POST   /accountupdate
                                {
                                        "idUser": 		INT,
                                        "roleLevel":            STRING,
                                        "email":  		STRING,    (need to check email unique)
                                        "username":             STRING,    (need to check username unique)
                                        "firstName":            STRING,
                                        "lastName":		STRING,
                                        "profile": 		STRING,  (if profile is not changed, send the original one)
                                        "introWords":           STRING,
                                        "resume":               STRING, (if role is student, be "")
                                        "company":              STRING, (if role is student, be "")
                                        "jobTitle":             STRING  (if role is student, be "")
                                } 

                Response:  User may not exits, receive 403 error
                                {
                                        "result":               INT  (0/1)
                                }

User Change Password: (wondering whether need the old password)
                Request: POST   /changepassword
                                {
                                    "idUser":       INT,
                                    "password":     STRING          (front end needs check re-enter password)
                                }

                Response:   User may not exits, receive 403 error
                                {
                                        "result":               INT  (0/1)
                                }    


**************************************** Student get all my asked questions ************************
For student to get all my questions::
                Request: POST   /student/questions
                                {
                                    "idUser":           INT,
                                    "idLecture":        INT
                                }

                Response:   it is possible to receive empty response. Order by sendTime
                                [
                                    {
                                        "lectureStatus":    STRING,  (live,replay,finish)
                                        "idQuestion":       INT,
                                        "username":         STRING,
                                        "content" :         STRING,
                                        "status":           STRING,
                                        "sendTime":         STRING (format: yyyy-MM-dd hh:mm:ss)
                                    },
                                    ...
                                ]
                                
***************************  Admin get all applications **********************
Administrator get all teacher applications
                Request: POST   /admin/teacherapplications
                                {
                                    "idAdmin":          INT,  (means the the admin role who logged in)
                                    "idUser":           INT (if idUser == -1, request all applications, otherwise, request the application of the idUser)
                                }

                Response:   it is possible to receive empty response.
                                [
                                    {
                                        "idUser": 		INT,  (this is the applicant)
                                        "firstName":            STRING,
                                        "lastName":		STRING,
                                        "profile": 		STRING,  (require upload the applicant's formal picture)
                                        "introWords":           STRING,
                                        "resume":               STRING, 
                                        "company":              STRING, 
                                        "jobTitle":             STRING,
                                        "applyStatus":          STRING    (new/read)
                                    } ,
                                    ...
                                ]
                
Admin makes an decision on a application: 
                Request: POST   /admin/applicationdecision
                                {
                                    "idAdmin":              INT,
                                    "email":                STRING,
                                    "idUser":               INT,
                                    "applyStatus":          STRING (can be "new","read","approve","decline")
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }        

**************************************** Permission code ******************************************                         
Student inputs permission code to enroll a course:
 
                Request:    POST   /student/permissioncode
                                {
                                    "idUser":       INT,
                                    "idLecture":    INT,
                                    "code"          STRING
                                }

                Response:   
                                {
                                    "result":       INT     (result=0 fail; reuslt=1 success)
                                }


************************************* Search **********************************
search:
 
                Request:    POST/GET   /search
                                {
                                    "type":         STRING,  ("all"/"course"/"lecture"/"teacher")
                                    "words":        STRING   (whole word search)
                                }

                Response:   
                                {
                                    "courses":
                                                [
                                                    {
                                                        "teacherFirstName":     STRING,
                                                        "teacherLastName":      STRING,
                                                        "courseInfo":           {
                                                                                    "idCourse":         INT,
                                                                                    "idUser":           INT,        (teacher id)
                                                                                    "category":         STRING,
                                                                                    "levelNumber":      INT,
                                                                                    "name":             STRING,
                                                                                    "intro":            STRING,
                                                                                    "image":            STRING,     (the image path/id of the course)
                                                                                    "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                                                                    "startDate":        STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                                                                    "endDate":          STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                                    "endFlag":          INT,         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                                                                        endFlag = 1, real endDate)
                                                                                }
                                                    },
                                                    ...,
                                                    ...
                                                ],
                                    "lectures": 
                                                [
                                                    {
                                                        "teacherFirstName":     STRING,
                                                        "teacherLastName":      STRING,
                                                        "idTeacher":            INT,
                                                        "lectureInfo":          {
                                                                                    "idLecture":        INT,
                                                                                    "idCourse":         INT,
                                                                                    "lectureNum":       INT,       
                                                                                    "topic":            STRING,
                                                                                    "intro":            STRING,     (may not be required)
                                                                                    "image":            STRING,     (the image path/id of the lecture, may need a default pic)
                                                                                    "scheduleDate":     STRING,     (format: "yyyy-MM-dd" Here time zone problem)
                                                                                    "startTime":        STRING,     (format: "hh:mm")
                                                                                    "endTime":          STRING,     (format: "hh:mm")
                                                                                    "createDate":       STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                                                                    "status":           STRING,         
                                                                                    "url":              STRING
                                                                                }
                                                    },
                                                    ...,
                                                    ...
                                                ],
                                    "teachers":  
                                                [
                                                    {   
                                                        "idUser":               INT,
                                                        "email":                STRING,    
                                                        "username":             STRING,   
                                                        "firstName":            STRING,
                                                        "lastName":             STRING,
                                                        "profile":              STRING,  
                                                        "introWords":           STRING,
                                                        "resume":               STRING, 
                                                        "company":              STRING, 
                                                        "jobTitle":             STRING 
                                                    },
                                                    ...,
                                                    ...
                                                ]
                                }

*************************************** Teacher question and answer during live video *********************************
Teacher can write a question or other things then answer it by himself/herself. The question status will be marked as "flag".
                Request: POST /teacher/questionanswer
				{
					"idUser":	INT,
					"username" :   	STRING,
					"idLecture":	INT,
				 	"content" : 	STRING
				}
		Response:
				{
					"result": INT 	(result=0 fail; reuslt=1 success)
				}