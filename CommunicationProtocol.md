
Base URL:
	http://bimolive.us-west-2.elasticbeanstalk.com/

All request and responses are in JSON.

Sign up - Check Username:
	Request: POST   /usernameCheck
			{
				"username": STRING
			}
	Response:
			{
				"result": INT   (result=0 invalid; reuslt=1 valid)
			}

Sign up - Check Email Address: 
	Request: POST    /emailCheck
			{
				"email": STRING
			}
	Response:
			{
				"result": INT 	(result=0 invalid; reuslt=1 valid)
			}

Login:
	Request: POST   /login
			{
				"email": STRING,
				"password": STRING
			} 

	Response (Not valid user):
			{
				"result": INT  (result = 0)
			}
	Response (valid user):
			{
				"result": 		INT,  (result = 1)
				"idUser": 		INT,
				"email":  		STRING,
				"username": 	STRING,
				"roleLevel":	INT,   (1:student; 2:teacher)
				"firstName":	STRING,
				"lastName":		STRING,
				"lastLogin":	STRING,
				"profile": 		STRING,
				"introWords":	STRING,
				"regisDate":	STRING
			}


Registration:
	Request: POST  /register
			{
				"email":		STRING,
				"username":		STRING,
				"password": 	STRING
			}

	Response:
			{
				"result": 		INT,  (result = 1)
				"idUser": 		INT,
				"email":  		STRING,
				"username": 	STRING,
				"roleLevel":	INT,   (1:student; 2:teacher)
				"firstName":	STRING,
				"lastName":		STRING,
				"lastLogin":	STRING,
				"profile": 		STRING,
				"introWords":	STRING,
				"regisDate":	STRING
			}

Question ask and answer:
	For student view to send a question:
		Request: POST /student/sendquestion
				{
					"idUser":		INT,
					"username" :   	STRING,
					"idLecture":	INT,
				 	"content" : 	STRING
				}
		Response:
				{
					"result": INT 	(result=0 fail; reuslt=1 success)
				}


	For teacher to get all questions:
		Request: POST  /teacher/questions
				{
					"idLecture":	INT,
					"interval":		INT (seconds, if interval == 0, get all questions with 'new' 
												status from this lecture;
										else, get questions with 'new' status between current time and current time - interval)
				}
				
		Response: it is possible to receive empty response
				[
					{
						"idQuestion":	INT,
						"username": 	STRING,
						"content" : 	STRING,
						"sentTime":		STRING
					},
					...
				]






