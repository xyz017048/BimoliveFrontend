
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
				"regisDate":            STRING
			}

Login:  (teacher: admin@gmail.com, admin;  student: student@gmail.com,  student)
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
				"regisDate":            STRING
			}

*********************************   Apply to be a teacher   **********************************
account setting, apply to be a teacher (change key)

Teacher generate a key:
                Request: POST   /teacher/generatekey
                                {
                                    "idUser":           INT
                                }
                Response:
                                {
                                    "keyString":        STRING
                                }


*********************************   Question send/get/answer/delete/ban/kick    **********************
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
                                    "idQuestion":       INT (if idQuestion == -1, get all questions with 'answer' status for student or 'new' status for teacher
												from this lecture;
										else, get questions after this idQuestion)
                                }
                Response:   it is possible to receive empty response.
                        note: for teacher, the questions are order by sendTime
                              for student, the questions are order by changeTime, which means the answering time.
                                [
					{
						"idQuestion":	INT,
						"username": 	STRING,
						"content" : 	STRING,
                                                "status":       STRING,
						"sendTime":	STRING (format: yyyy-MM-dd hh:mm:ss)
					},
					...
				]
                         
        Teacher makes an action on a question: 
                Request: POST   /teacher/questionaction
                                {
                                    "idQuestion":       INT,
                                    "status":           STRING (can be "delete","answer", "ban","kick")
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
                                        "idCourse":     INT,
                                        "idUser":       INT,
                                        "category":     STRING,
                                        "levelNumber":  INT,
                                        "name":         STRING,
                                        "intro":        STRING,
                                        "image":        STRING,     (the image path/id of the course)
                                        "createDate":   STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                        "startDate":    STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                        "endDate":      STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                        "endFlag":      INT         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                 endFlag = 1, real endDate)
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
                                    "idCourse":     INT,
                                    "idUser":       INT,
                                    "category":     STRING,
                                    "levelNumber":  INT,
                                    "name":         STRING,
                                    "intro":        STRING,
                                    "image":        STRING,     (the image path/id of the course)
                                    "createDate":   STRING,     (format: "yyyy-MM-dd hh:mm:ss" )
                                    "startDate":    STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                    "endDate":      STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                    "endFlag":      INT         (endFlag = 0, no endDate, make endDate same as startDate;
                                                             endFlag = 1, real endDate)
                                }
                                

        Create a course:
                Request: POST   /teacher/createcourse
                                {
                                    "idUser":       INT,
                                    "category":     STRING,
                                    "levelNumber":  INT,
                                    "name":         STRING,
                                    "intro":        STRING,
                                    "image":        STRING,     (the image path/id of the course)
                                    "startDate":    STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                    "endDate":      STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                    "endFlag":      INT         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                 endFlag = 1, real endDate)
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }

        Teacher update a course:

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
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }
        Teacher update a lecture:

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

************************    Student get course/lecture info ***************************

Student Get a single Lecture:         NOTE: if 'status' == 'wait', student can only see the info of this lecture.
                                            if 'status' == 'live', show the live video to the student, and can send a question if login
                                            if 'status' == 'replay', show the video to the student, all answered questions should display in the question panel,
                                                                      and disable sending question channel.
                Request:    POST    /student/singlelecture
                                {
                                    "idLecture":         INT,
                                }                                 
                Response:   
                                {
                                    "teacherFirstName":     STRING,
                                    "teacherLastName":      STRING,
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


In replay mode, get all answered questions:


