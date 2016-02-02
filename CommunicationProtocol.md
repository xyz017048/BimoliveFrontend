
Base URL:
	http://bimolive.us-west-2.elasticbeanstalk.com/

All request and responses are in JSON.

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

Login:
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

account setting, apply to be a teacher

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
                                    "interval":         INT (seconds, if interval == 0, get all questions with 'answer' and 'solve' status for student or 'new' status for teacher
												from this lecture;
										else, get questions between current time and current time - interval)
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
                         
        Teacher makes an action on a question: (Once the teacher answers the question, he/she must click the "solve" button to close the dialog box. No other way ALLOWED to close it.)
                Request: POST   /teacher/questionaction
                                {
                                    "idQuestion":       INT,
                                    "status":           STRING (can be "answer", "solve", "ban","kick")
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }        

Teacher create/get courses/lectures:
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

get all live videos


get all replay videos