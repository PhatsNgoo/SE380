const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseHelper = require('firebase-functions-helper')
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./modules/api/users/controller');
const subjectController = require('./modules/api/subject/controller');
const scheduleController = require('./modules/api/schedule/controller');
const scoreboardController=require('./modules/api/scoreboard/controller');
const curriculumController=require('./modules/api/curriculum/controller');
const divisonController=require('./modules/api/division/controller');
const employeeController=require('./modules/api/employee/controller');
const majorController=require('./modules/api/major/controller');
const studentController=require('./modules/api/student/controller');
const calendarController=require('./modules/api/calendar/controller');
admin.initializeApp();

const app = express();
const main = express();


const contactsCollection = 'contacts';

main.use('/api/v1', app);
main.use(bodyParser.json());

exports.webApi = functions.https.onRequest(main);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Format api
// DO NOT EVER SEND ONLY NUMBER WITHOUT TOSTRING() IN RESPONSE.SEND. IT WILL LEAD INTO ERROR STATUS IN RESPONSE
// user api
app.get('/user/', userController.getalluserInfo);
app.post('/user/login', userController.login);
app.get('/user/:userName', userController.getuserinfo);
app.post('/user/new', userController.createuser);
app.put('/user/:userName');//Change user information
app.delete('/user/:userName',userController.deleteuser);//Delete user api;

// curriculum API
app.get('/curriculum/:majorID',curriculumController.getcurriculum);//get curriculum by major ID
app.post('/curriculum/',curriculumController.newcurriculum);//Import new curriculum with post method
app.put('/curriculum/:majorID');//update curriculum
app.delete('/curriculum/:majorID',curriculumController.deletecurriculum);//delete curriculum

// subject api
app.get('/subject/', subjectController.getallsubject);
app.get('/subject/:subjectID', subjectController.getsubject);
app.post('/subject/',subjectController.newsubject);//create new subject
app.put('/subject/:subjectID');//update subject
app.delete('/subject/:subjectID',subjectController.deletesubject);//delete subject

// scoreboard api
app.get('/scoreboard/:studentID',scoreboardController.getscoreboard);
app.get('/scoreboard',scoreboardController.getallscroreboard);//Get all student scoreboard
app.post('/scoreboard/',scoreboardController.scoreboard);
app.put('/scoreboard/:studentID');//update student scorebnoard
app.delete('/scoreboard/:studentID',scoreboardController.deletescoreboard);//delete student scoreboard

app.get('/scoreboard/',scoreboardController.getallscroreboard);

// schedule api
app.get('/schedule/', scheduleController.getallschedule);
app.get('/schedule/:semesterID', scheduleController.getschedule);
app.post('/schedule/:semesterID/import', scheduleController.importschedule);
app.put('/schedule/:semesterID');//update new schedule
app.delete('/schedule/:semesterID',scheduleController.deleteschedule);//delete schedule


//calendar api
app.get('/calendar/',calendarController.gettallcalendar);//Get all time for registation
app.get('/calendar/:semesterID',calendarController.getcalendar);//Get time for registation
app.post('/calendar/',calendarController.newcalendar);//Use to create new item
app.put('/calendar/:semesterID',calendarController.editcalendar);//update new item
app.delete('/calendar/:semesterID',calendarController.deletecalendar);//Use to delete item

//division api
app.get('/division/:divisionID',divisonController.getdivision);//Get division info
app.post('/division/',divisonController.newdivision);//create new division
app.delete('/division/:divisionID',divisonController.deletedivision);//delete a division

//major api
app.get('/major/:majorID',majorController.getmajor);//Get major info
app.post('/major/',majorController.newmajor);//create new major
app.delete('/major/:majorID',majorController.deletemajor);//delete a major

//employee api
app.get('/employee/:employeeID',employeeController.getemployee);//Get employee info
app.post('/employee/',employeeController.newemployee);//create new employee
app.delete('/employee/:employeeID',employeeController.deleteemployee);//delete a employee

//student api
app.get('/student/:studentID',studentController.getstudent);//Get student info
app.get('/student',studentController.getallstudent);//Get student info
app.post('/student/',studentController.newstudent);//create new student
app.post('/student/enroll',studentController.enrollClass);//create new student
app.post('/student/cancel',studentController.cancelClass);//create new student
app.delete('/student/:studentID',studentController.deletestudent);//delete a student
