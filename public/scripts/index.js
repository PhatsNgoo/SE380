window.onload = initialize();

var userInfo = localStorage['UserInfo'] != null ? JSON.parse(localStorage['UserInfo']) : null;
var studentInfo;
var schedule;
var scoreboard;
var studentList;
var enrollDate;
var startEnrollDate;
var endEnrollDate;
var currentDate = new Date();
var scoreboardList;
//Define role 3 as student, role 2 as lecturer, role 1 as division assistant, role 0 as admin
function initialize() {

    if (localStorage['UserInfo'] == null) {
        location.replace('./login.html');
    }
    setUpView();
    loadSemesterID();
    if (userInfo.Role == 3) {
        studentInfo = getUserInfo();
        scoreboard = getScoreboard();
        enrollDate = JSON.parse(getEnrollDate());
        startEnrollDate = new Date(enrollDate.StartDate);
        endEnrollDate = new Date(enrollDate.EndDate);
        console.log(startEnrollDate + '---' + endEnrollDate);
    } else if (userInfo.Role == 1) {
        scoreboardList = getScoreboadList();
    }
    schedule = getSchedule('HK2_N2_2019');

}

function loadSemesterID() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/schedule';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    xmlhttp.onload = onloadSemesterID(xmlhttp.responseText);
}

function onloadSemesterID(response) {
    let select = document.getElementById('ScheduleSelect');
    let select2 = document.getElementById('LecturerScheduleExportSelect');
    let select3 = document.getElementById('ExportClassroomSelect');
    let array = [];
    array = JSON.parse(response);
    for (let i = 0; i < array.length; i++) {
        let opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select.appendChild(opt);
        opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select2.appendChild(opt);
        opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select3.appendChild(opt);
    }
}

function setUpView() {
    document.getElementById("Username").innerHTML = userInfo.UserName;
    hideAllTab();
    if (userInfo.Role == 3) {
        document.getElementById("admintaskbar").style.display = "none";
        document.getElementById("assistanttaskbar").style.display = "none";
        document.getElementById("usertaskbar").style.display = "block";
        document.getElementById("teachertaskbar").style.display = "none";
        document.getElementById("importfeature").style.display = "none";
    } else if (userInfo.Role == 2) {
        document.getElementById("admintaskbar").style.display = "none";
        document.getElementById("assistanttaskbar").style.display = "none";
        document.getElementById("usertaskbar").style.display = "none";
        document.getElementById("teachertaskbar").style.display = "block";
        document.getElementById("importfeature").style.display = "none";
    } else if (userInfo.Role == 1) {
        document.getElementById("admintaskbar").style.display = "none";
        document.getElementById("assistanttaskbar").style.display = "block";
        document.getElementById("usertaskbar").style.display = "none";
        document.getElementById("teachertaskbar").style.display = "none";
        document.getElementById("importfeature").style.display = "inline-block";
    } else if (userInfo.Role == 0) {
        document.getElementById("admintaskbar").style.display = "block";
        document.getElementById("assistanttaskbar").style.display = "none";
        document.getElementById("usertaskbar").style.display = "none";
        document.getElementById("teachertaskbar").style.display = "none";
        document.getElementById("importfeature").style.display = "none";
    }
}

function hideAllTab() {
    RemoveTable('#datatable');
    RemoveTable('#studentschedule');
    RemoveTable('#lecturerschedule');
    RemoveTable('#ForceEnrollStudentSchedule');
    document.getElementById("ImportCurriculumButton").style.display = "none";
    document.getElementById("ScheduleSelect").style.display = "none";
    document.getElementById("CurriculumSelect").style.display = "none";
    document.getElementById("StudentScoreBoardSelect").style.display = "none";
    document.getElementById("StudentSchedule").style.display = "none";
    document.getElementById("ImportScoreboardButton").style.display = "none";
    document.getElementById("ImportScheduleButton").style.display = "none";
    document.getElementById("isNotInTimeToEnroll").style.display = "none";
    document.getElementById("ExportStudentSchedule").style.display = "none";
    document.getElementById("ForceEnrollTab").style.display = "none";
    document.getElementById("PersonalScheduleTab").style.display = "none";
    document.getElementById("LecturerScheduleTab").style.display = "none";
    document.getElementById("ReportTab").style.display = "none";
}

function openReportTab() {
    hideAllTab();
    document.getElementById("ReportTab").style.display = "inline-block";
}

function openViewScheduleTab() {
    hideAllTab();
    document.getElementById("PersonalScheduleTab").style.display = "inline-block";
}

function openCurriculumTab() {
    hideAllTab();
    document.getElementById("ImportCurriculumButton").style.display = "inline-block";
    document.getElementById("CurriculumSelect").style.display = "inline-block";
}

function openStudentScheduleTab() {
    hideAllTab();
    document.getElementById("StudentSchedule").style.display = "inline-block";
}

function openScoreboardTab() {
    hideAllTab();
    let select = document.getElementById('StudentScoreBoardSelect');
    select.innerHTML = "<option value=" + 0 + ">Chon sinh vien</option>";
    for (let i = 0; i < scoreboardList.length; i++) {
        let opt = document.createElement('option');
        opt.value = scoreboardList[i];
        opt.innerHTML = scoreboardList[i];
        select.appendChild(opt);
    }
    document.getElementById("StudentScoreBoardSelect").style.display = "inline-block";
    document.getElementById("ImportScoreboardButton").style.display = "inline-block";
}

function openScheduleTab() {
    hideAllTab();
    if (userInfo.Role == 2) {
        document.getElementById("LecturerScheduleTab").style.display = "inline-block";
    }
    document.getElementById("ScheduleSelect").style.display = "inline-block";
    document.getElementById("ImportScheduleButton").style.display = "inline-block";
}

function openForceEnrollForm() {
    closeForm();
    document.getElementById("forceEnrollForm").style.display = "block";
}

function openCancelForceEnrollForm() {
    closeForm();
    document.getElementById("cancelForceEnrollForm").style.display = "block";
}

function openForceEnroll() {
    hideAllTab();
    openRegisterTabAdmin();
}

function openRegisterTab() {
    hideAllTab();
    console.log(currentDate > startEnrollDate);
    console.log(currentDate < endEnrollDate);
    if (currentDate > startEnrollDate && currentDate < endEnrollDate) {
        getRegistedList();
    } else {
        showNotifi();
    }
}

function showNotifi() {
    document.getElementById("isNotInTimeToEnroll").style.display = "inline-block";
}

function openRegisterTabAdmin() {
    hideAllTab();
    document.getElementById("ForceEnrollTab").style.display = "inline-block";
    generateStudentListAdmin();
    getRegistedListAdmin();
}

function getPersonalSchedule(PersonalID) {
    if (PersonalID.trim() != '') {
        let url = 'https://subjectregister.firebaseapp.com/api/v1/user/' + PersonalID.toUpperCase();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', url, false);
        xmlhttp.send();
        personalInfo = JSON.parse(xmlhttp.responseText);
        if (personalInfo != null) {
            if (personalInfo.Role == 2) {
                showLecturerScheduleWithID(personalInfo.UserName, 'HK2_N2_2019');
            } else if (personalInfo.Role == 3) {
                studentInfo = getStudentInfo(personalInfo.UserName);
                showStudentScheduleAsCalendarAdmin('HK2_N2_2019');
            }
        } else {
            window.alert('Ma nguoi dung khong hop le vui long thu lai');
        }
    } else {
        window.alert('Vui long nhap ma nguoi dung va thu lai sau.');
    }
}

function GetStudentScoreboard(StudentID) {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/scoreboard/' + StudentID;
    let scoreboardReq = new XMLHttpRequest();
    scoreboardReq.open('GET', url, false);
    scoreboardReq.send();
    var data = JSON.parse(scoreboardReq.responseText)
    var newArrayDataOfOjbect = Object.values(data)
    showTable(newArrayDataOfOjbect);
}

function getUserInfo() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/student/' + localStorage['Username'];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    return JSON.parse(xmlhttp.responseText);
}

function getStudentInfo(studentID) {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/student/' + studentID;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    return JSON.parse(xmlhttp.responseText);
}

function getSchedule(semesterID) {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/schedule/' + semesterID;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

function getScoreboard() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/scoreboard/' + studentInfo.StudentID;
    let scoreboardReq = new XMLHttpRequest();
    scoreboardReq.open('GET', url, false);
    scoreboardReq.send();
    return scoreboardReq.responseText;
}

function getEnrollDate() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/calendar/hk2_n2_2019';
    let calendarReq = new XMLHttpRequest();
    calendarReq.open('GET', url, false);
    calendarReq.send();
    return calendarReq.responseText;
}

function getScoreboadList() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/scoreboard';
    let scoreboardReq = new XMLHttpRequest();
    scoreboardReq.open('GET', url, false);
    scoreboardReq.send();
    return JSON.parse(scoreboardReq.responseText);
}

function openCancelEnrollForm(SubjectID) {
    document.getElementById("buttonCancelEnrollForm").innerHTML = '';
    document.getElementById("cancelEnrollForm").style.display = "inline-block";
    document.getElementById("buttonCancelEnrollForm").innerHTML += '<button type="button" onclick="cancelClass(' + "'" + SubjectID + "'" + ')">Xác nhận</button>';
    document.getElementById("buttonCancelEnrollForm").innerHTML += '<button type="button" class="btncancel" onclick="closeForm()">Đóng</button>';

}

function openCancelForceEnrollConfirm(SubjectID) {
    document.getElementById("buttonCancelForceEnrollConfirm").innerHTML = '';
    document.getElementById("cancelForceEnrollConfirm").style.display = "inline-block";
    document.getElementById("buttonCancelForceEnrollConfirm").innerHTML += '<button type="button" onclick="forceCancelClass()">Xác nhận</button>';
    document.getElementById("buttonCancelForceEnrollConfirm").innerHTML += '<button type="button" class="btncancel" onclick="closeForm()">Đóng</button>';

}

function sumCreditsArray(array) {
    var total = 0
    for (var i = 0, _len = array.length; i < _len; i++) {
        if (!array[i]['SubjectID'].includes('PG')) {
            total += parseInt(array[i]['Credits'])
        }
    }
    return total
}