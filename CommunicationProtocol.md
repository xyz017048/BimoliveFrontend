
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
                                [
					{
						"idQuestion":	INT,
						"username": 	STRING,
						"content" : 	STRING,
                                                "status":       STRING,
						"sendTime":	STRING (format: yyyy-mm-dd hh:mm:ss)
					},
					...
				]
                         
        Teacher makes an action on a question:
                Request: POST   /teacher/questionaction
                                {
                                    "idQuestion":       INT,
                                    "status":           STRING (can be "answer", "solve", "ban","kick")
                                }
                Response:
                                {
                                    "result":           INT (result=0 fail; reuslt=1 success)
                                }        





