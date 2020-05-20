function generateStudentScheduleAdmin(StudentID) {
    RemoveTable('#ForceEnrollStudentSchedule');
    if (StudentID != 0) {
        studentInfo = getStudentInfo(StudentID.toString().toUpperCase());
        if (studentInfo == null) {
            window.alert("Ma sinh vien khong hop le hoac khong ton tai vui long thu lai");
            return;
        }
        let resultArray = generateStudentSchedule('HK2_N2_2019');
        let subjectArray = [];
        for (let i = 0; i < resultArray.length; i++) {
            if (subjectArray.indexOf(resultArray[i].SubjectID) === -1) {
                subjectArray.push(resultArray[i].SubjectID);
            }
        }
        let select = document.getElementById('cancelForceEnrollClassList');
        for (let i = 0; i < subjectArray.length; i++) {
            let opt = document.createElement('option');
            let temp = resultArray.filter(({ SubjectID }) => SubjectID === subjectArray[i]);
            opt.value = temp[0].ClassID + '-D' + temp[0].Day + '-S' + temp[0].Shiff;
            for (let j = 1; j < temp.length; j++) {
                opt.value += '/' + temp[j].ClassID + '-D' + temp[j].Day + '-S' + temp[j].Shiff;
            }
            opt.innerHTML = opt.value;
            select.appendChild(opt);
        }
        showStudentScheduleAsCalendarAdmin('HK2_N2_2019');
    } else {
        window.alert("Ma sinh vien khong hop le hoac khong ton tai vui long thu lai");
    }
}

function showStudentScheduleAsCalendarAdmin(SemesterID) {
    let schedule = generateStudentSchedule(SemesterID);
    let splitSchedule = [2, 3, 4, 5, 6, 7, 1];
    for (let i = 0; i < splitSchedule.length; i++) {
        splitSchedule[i] = schedule.filter(({ Day }) => Day == splitSchedule[i]);
        for (let j = 0; j < splitSchedule[i].length; j++) {
            splitSchedule[i][j].ShiffStart = splitSchedule[i][j].Shiff.split('-')[0];
            splitSchedule[i][j].ShiffEnd = splitSchedule[i][j].Shiff.split('-')[1];
        }
    }
    buildStudentScheduleAdmin(splitSchedule);
    // buildHtmlTable("#studentschedule", generateStudentSchedule('HK2_N2_2019'));
    //$('#studentschedule').show();
}

function buildStudentScheduleAdmin(schedule) {
    document.getElementById('ForceEnrollStudentSchedule').innerHTML = '<tr><th>Shiff</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th></tr><tr id="firstShiff"><td>1</td></tr><tr id="secondShiff"><td>2</td></tr><tr id="thirdShiff"><td>3</td></tr><tr id="fourthShiff"><td>4</td></tr><tr id="fifthShiff"><td>5</td></tr><tr id="sixthShiff"><td>6</td></tr><tr id="seventhShiff"><td>7</td></tr><tr id="eigthShiff"><td>8</td></tr><tr id="ninethShiff"><td>9</td></tr><tr id="tenthShiff"><td>10</td></tr>';
    let row = document.getElementById('firstShiff');
    for (let i = 1; i < 11; i++) {
        if (i == 1) { let row = document.getElementById('firstShiff'); } else if (i == 2) { row = document.getElementById('secondShiff'); } else if (i == 3) { row = document.getElementById('thirdShiff'); } else if (i == 4) { row = document.getElementById('fourthShiff'); } else if (i == 5) { row = document.getElementById('fifthShiff'); } else if (i == 6) { row = document.getElementById('sixthShiff'); } else if (i == 7) { row = document.getElementById('seventhShiff'); } else if (i == 8) { row = document.getElementById('eigthShiff'); } else if (i == 9) { row = document.getElementById('ninethShiff'); } else if (i == 10) { row = document.getElementById('tenthShiff'); }
        for (let j = 0; j < schedule.length; j++) {
            let index = schedule[j].findIndex(({ ShiffStart }) => ShiffStart == i);
            let indexInRange = schedule[j].findIndex(({ ShiffStart, ShiffEnd }) => i >= ShiffStart && i <= ShiffEnd);
            if (index != -1) {
                let cell = row.insertCell(-1);
                cell.innerHTML = schedule[j][index].ClassID + "-Room:" + schedule[j][index].Room;
                cell.rowSpan = schedule[j][index].ShiffEnd - schedule[j][index].ShiffStart + 1;
            }
            if (indexInRange != -1) {} else {
                let cell = row.insertCell(-1);
                cell.innerHTML = '';
            }
        }
    }
}

function forceCancelClass() {
    classID = document.getElementById('cancelForceEnrollClassList').value;
    let idArray = classID.split('.').join('-').split('/');
    let requestbody = new cancelObject(studentInfo.StudentID, idArray, 'HK2_N2_2019');
    let cancelUrl = 'https://subjectregister.firebaseapp.com/api/v1/student/cancel';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', cancelUrl, false);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(requestbody));
    if (xmlhttp.responseText === "Complete") {
        alert("Huy ep cung mon hoc thanh cong");
        generateStudentScheduleAdmin(studentInfo.StudentID);

    } else {
        alert("Loi khong xac dinh hay thu lai sau");
    }
}

function onloadStudentList(studentArray) {
    // let select = document.getElementById('forceEnrollStudentList');
    // let selectCancel = document.getElementById('cancelForceEnrollStudentList');
    // for (let i = 0; i < studentArray.length; i++) {
    //     let opt = document.createElement('option');
    //     opt.value = studentArray[i].StudentID;
    //     opt.innerHTML = studentArray[i].StudentID;
    //     select.appendChild(opt);
    //     opt = document.createElement('option');
    //     opt.value = studentArray[i].StudentID;
    //     opt.innerHTML = studentArray[i].StudentID;
    //     selectCancel.appendChild(opt);
    // }
}

function generateStudentSubject(StudentID) {
    RemoveTable('#ForceEnrollStudentSchedule');
    if (StudentID != 0) {
        studentInfo = getStudentInfo(StudentID.toString().toUpperCase());
        if (studentInfo == null) {
            window.alert("Ma sinh vien khong hop le hoac khong ton tai vui long thu lai");
            return;
        }
        scoreboard = getScoreboard();
        let url = 'https://subjectregister.firebaseapp.com/api/v1';
        let CurriculumURL = url + '/curriculum/' + studentInfo.MajorID.slice(0, 2);
        let curriculumReq = new XMLHttpRequest();
        curriculumReq.open('GET', CurriculumURL, false);
        curriculumReq.send();
        let arrayRes = filterSubjectForForceEnroll(scoreboard, curriculumReq.responseText);
        console.log(arrayRes);
        let select = document.getElementById('forceEnrollSubjectList');
        select.innerHTML = "<option value=" + 0 + ">Chọn môn học</option>";
        for (let i = 0; i < arrayRes.length; i++) {
            let opt = document.createElement('option');
            opt.value = arrayRes[i].SubjectID;
            opt.innerHTML = arrayRes[i].SubjectName;
            select.appendChild(opt);
        }
        showStudentScheduleAsCalendarAdmin('HK2_N2_2019');
    } else {
        window.alert("Ma sinh vien khong hop le hoac khong ton tai vui long thu lai");
        let select = document.getElementById('forceEnrollSubjectList');
        select.innerHTML = "<option value=" + 0 + ">Chọn môn học</option>";
    }
}

function generateSubjectClass(SubjectID) {
    if (SubjectID != 0) {
        groupSubjectSchedule(getSubjectSchedule(SubjectID));
    } else {
        let select = document.getElementById('forceEnrollClassList');
        select.innerHTML = "<option value=" + 0 + ">Chọn lớp</option>";
    }
}

function forceEnroll() {
    //Enroll with classID and save to Student table and schedule table
    if ($("#forceEnrollClassList").children("option:selected").val().toString() !== 'null') {
        let studentSchedule = generateStudentSchedule('HK2_N2_2019');
        let scheduleJSON = JSON.parse(schedule);
        let classArray = $("#forceEnrollClassList").children("option:selected").val().toString().split('/');
        for (let i = 0; i < classArray.length; i++) {
            let item = scheduleJSON[classArray[i].split('.').join('-')];
            let shiffStart = item.Shiff.split('-')[0];
            let shiffEnd = item.Shiff.split('-')[1];
            let classWithSameDay = studentSchedule.filter(({ Day }) => Day === item.Day);
            for (let j = 0; j < classWithSameDay.length; j++) {
                //Filter class in same day
                let start = classWithSameDay[j].Shiff.split('-')[0];
                let end = classWithSameDay[j].Shiff.split('-')[1];
                if ((start >= shiffStart && start <= shiffEnd) || (end >= shiffStart && end <= shiffEnd)) {
                    alert('You have a class in this time please choose another');
                    return;
                }
            }
            if (studentSchedule.findIndex(({ SubjectID }) => SubjectID === item.SubjectID) !== -1) {
                alert('You have already enroll this class');
                return;
            }
        }
        let requestbody = new enrollObject(studentInfo.StudentID, classArray, 'HK2_N2_2019');
        let enrollUrl = 'https://subjectregister.firebaseapp.com/api/v1/student/enroll';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', enrollUrl, false);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(requestbody));
        if (xmlhttp.responseText === "Complete") {
            alert("Ep cung mon hoc thanh cong");
            generateStudentSubject(studentInfo.StudentID);
        } else {
            alert("Loi khong xac dinh hay thu lai sau");
        }
    } else {
        alert('This class is full please choose another');
    }
}

function generateStudentListAdmin() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/student';
    let studentReq = new XMLHttpRequest();
    studentReq.open('GET', url, false);
    studentReq.send();
    studentReq.onload = onloadStudentList(snapshotToArray(studentReq.responseText));
}

function openRegisterForm(SubjectID) {
    document.getElementById("registerForm").style.display = "inline-block";
    groupSubjectSchedule(getSubjectSchedule(SubjectID));
}

function getRegistedList() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1';
    let CurriculumURL = url + '/curriculum/' + studentInfo.MajorID.slice(0, 2);
    let curriculumReq = new XMLHttpRequest();
    curriculumReq.open('GET', CurriculumURL, false);
    curriculumReq.send();
    filterSubject(scoreboard, curriculumReq.responseText);
}

function getRegistedListAdmin() {
    let data = snapshotToArray(schedule);
    for (let i = 0; i < data.length; i++) {
        let studentsList = data[i].StudentsList !== undefined ? Object.keys(data[i].StudentsList).map((o) => data[i].StudentsList[o]) : [];
        data[i].Count = studentsList.length + '/' + data[i].MaxStudents;
    }
    buildHtmlTable("#datatable", data);
    $('#datatable').show();
}
var scheduleObject = [];

function filterSubjectForForceEnroll(scoreboard, curriculum) {
    scheduleObject = snapshotToArray(schedule);
    let scoreboardObject = snapshotToArray(scoreboard);
    let result = JSON.parse(curriculum);
    for (let i = 0; i < scoreboardObject.length; i++) {
        if (scoreboardObject[i].Score >= 5) {
            let index = result.findIndex(({ SubjectID }) => SubjectID === scoreboardObject[i].SubjectID);
            if (index !== -1) {
                result.splice(index, 1);
            }
        }
    }
    for (let i = 0; i < result.length; i++) {
        let index = scheduleObject.findIndex(({ SubjectID }) => SubjectID === result[i].SubjectID);
        if (index !== -1) {} else {
            result.splice(i, 1);
            i--;
        }
    }
    return result;
}

function filterSubject(scoreboard, curriculum) {
    scheduleObject = snapshotToArray(schedule);
    let scoreboardObject = snapshotToArray(scoreboard);
    let result = JSON.parse(curriculum);
    for (let i = 0; i < scoreboardObject.length; i++) {
        if (scoreboardObject[i].Score >= 5) {
            let index = result.findIndex(({ SubjectID }) => SubjectID === scoreboardObject[i].SubjectID);
            if (index !== -1) {
                result.splice(index, 1);
            }
        }
    }
    for (let i = 0; i < result.length; i++) {
        let index = scheduleObject.findIndex(({ SubjectID }) => SubjectID === result[i].SubjectID);
        if (index !== -1) {} else {
            result.splice(i, 1);
            i--;
        }
    }
    let credits = sumCreditsArray(scoreboardObject);
    for (let i = 0; i < result.length; i++) {
        if (result[i]['CreditsPrerequisites'] !== undefined && credits < result[i]['CreditsPrerequisites']) {
            result.splice(i, 1);
            i--;
            //remove here
        }
        if (result[i]['SubjectPrerequisites'] !== undefined) {
            let prerequisitesArray = result[i]['SubjectPrerequisites'].replace(/ /g, '').split(',');
            for (let j = 0; j < prerequisitesArray.length; j++) {
                if (scoreboardObject.findIndex(({ SubjectID }) => SubjectID === prerequisitesArray[j]) == -1) {
                    result.splice(i, 1);
                    i--;
                    break;
                    //remove here
                }
            }
        }
    }
    let currentSchedule = generateStudentSchedule('HK2_N2_2019');
    for (let i = 0; i < result.length; i++) {
        if (currentSchedule.findIndex(({ SubjectID }) => SubjectID === result[i].SubjectID) !== -1) {
            result[i].isRegisted = true;
            let temp = currentSchedule.filter(({ SubjectID }) => SubjectID === result[i].SubjectID);
            result[i].ClassID = temp[0].ClassID + '-D' + temp[0].Day + '-S' + temp[0].Shiff;
            for (let j = 1; j < temp.length; j++) {
                result[i].ClassID += '/' + temp[j].ClassID + '-D' + temp[j].Day + '-S' + temp[j].Shiff;
            }
        }
    }
    registing = true;
    buildHtmlTable("#datatable", result);
    $('#datatable').show();
    showStudentScheduleAsCalendar('HK2_N2_2019');
}

function showStudentScheduleAsCalendar(SemesterID) {
    document.getElementById("ExportStudentSchedule").style.display = "inline-block";
    let schedule = generateStudentSchedule(SemesterID);
    let splitSchedule = [2, 3, 4, 5, 6, 7, 1];
    for (let i = 0; i < splitSchedule.length; i++) {
        splitSchedule[i] = schedule.filter(({ Day }) => Day == splitSchedule[i]);
        for (let j = 0; j < splitSchedule[i].length; j++) {
            splitSchedule[i][j].ShiffStart = splitSchedule[i][j].Shiff.split('-')[0];
            splitSchedule[i][j].ShiffEnd = splitSchedule[i][j].Shiff.split('-')[1];
        }
    }
    buildStudentSchedule(splitSchedule);
    // buildHtmlTable("#studentschedule", generateStudentSchedule('HK2_N2_2019'));
    //$('#studentschedule').show();
}

function buildStudentSchedule(schedule) {
    document.getElementById('studentschedule').innerHTML = '<tr><th>Shiff</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th></tr><tr id="firstShiff"><td>1</td></tr><tr id="secondShiff"><td>2</td></tr><tr id="thirdShiff"><td>3</td></tr><tr id="fourthShiff"><td>4</td></tr><tr id="fifthShiff"><td>5</td></tr><tr id="sixthShiff"><td>6</td></tr><tr id="seventhShiff"><td>7</td></tr><tr id="eigthShiff"><td>8</td></tr><tr id="ninethShiff"><td>9</td></tr><tr id="tenthShiff"><td>10</td></tr>';
    let row = document.getElementById('firstShiff');
    for (let i = 1; i < 11; i++) {
        if (i == 1) { let row = document.getElementById('firstShiff'); } else if (i == 2) { row = document.getElementById('secondShiff'); } else if (i == 3) { row = document.getElementById('thirdShiff'); } else if (i == 4) { row = document.getElementById('fourthShiff'); } else if (i == 5) { row = document.getElementById('fifthShiff'); } else if (i == 6) { row = document.getElementById('sixthShiff'); } else if (i == 7) { row = document.getElementById('seventhShiff'); } else if (i == 8) { row = document.getElementById('eigthShiff'); } else if (i == 9) { row = document.getElementById('ninethShiff'); } else if (i == 10) { row = document.getElementById('tenthShiff'); }
        for (let j = 0; j < schedule.length; j++) {
            let index = schedule[j].findIndex(({ ShiffStart }) => ShiffStart == i);
            let indexInRange = schedule[j].findIndex(({ ShiffStart, ShiffEnd }) => i >= ShiffStart && i <= ShiffEnd);
            if (index != -1) {
                let cell = row.insertCell(-1);
                cell.innerHTML = schedule[j][index].ClassID + "-Room:" + schedule[j][index].Room;
                cell.rowSpan = schedule[j][index].ShiffEnd - schedule[j][index].ShiffStart + 1;
            }
            if (indexInRange != -1) {} else {
                let cell = row.insertCell(-1);
                cell.innerHTML = '';
            }
        }
    }
}

function onloadClassList(resultArray) {

    let select = document.getElementById('SubjectList');
    select.innerHTML = '';
    let array = resultArray;
    for (let i = 0; i < array.length; i++) {
        let opt = document.createElement('option');
        let studentsList = array[i][0].StudentsList !== undefined ? Object.keys(array[i][0].StudentsList).map((o) => array[i][0].StudentsList[o]) : [];
        if (studentsList.length < array[i][0].MaxStudents) {
            opt.value += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff;
            opt.innerHTML += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff + '-' + studentsList.length + '-' + array[i][0].MaxStudents;
        } else {
            opt.value = null;
            opt.innerHTML += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff + '-' + studentsList.length + '-' + array[i][0].MaxStudents;
        }
        for (let j = 1; j < array[i].length; j++) {
            let studentsList = array[i][j].StudentsList !== undefined ? Object.keys(array[i][j].StudentsList).map((o) => array[i][j].StudentsList[o]) : [];
            if (studentsList.length < array[i][j].MaxStudents) {
                opt.value += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff;
                opt.innerHTML += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff + '-' + studentsList.length + '-' + array[i][j].MaxStudents;
            } else {
                opt.value = null;
                opt.innerHTML += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff + '-' + studentsList.length + '-' + array[i][j].MaxStudents;
            }
        }
        select.appendChild(opt);
    }
}

function onloadClassListAdmin(resultArray) {
    let select = document.getElementById('forceEnrollClassList');
    select.innerHTML = '';
    let array = resultArray;
    for (let i = 0; i < array.length; i++) {
        let opt = document.createElement('option');
        let studentsList = array[i][0].StudentsList !== undefined ? Object.keys(array[i][0].StudentsList).map((o) => array[i][0].StudentsList[o]) : [];
        if (studentsList.length < array[i][0].MaxStudents) {
            opt.value += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff;
            opt.innerHTML += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff + '-' + studentsList.length + '-' + array[i][0].MaxStudents;
        } else {
            opt.value = null;
            opt.innerHTML += array[i][0].ClassID + '-D' + array[i][0].Day + '-S' + array[i][0].Shiff + '-' + studentsList.length + '-' + array[i][0].MaxStudents;
        }
        for (let j = 1; j < array[i].length; j++) {
            let studentsList = array[i][j].StudentsList !== undefined ? Object.keys(array[i][j].StudentsList).map((o) => array[i][j].StudentsList[o]) : [];
            if (studentsList.length < array[i][j].MaxStudents) {
                opt.value += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff;
                opt.innerHTML += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff + '-' + studentsList.length + '-' + array[i][j].MaxStudents;
            } else {
                opt.value = null;
                opt.innerHTML += '/' + array[i][j].ClassID + '-D' + array[i][j].Day + '-S' + array[i][j].Shiff + '-' + studentsList.length + '-' + array[i][j].MaxStudents;
            }
        }
        select.appendChild(opt);
    }
}

function getSubjectSchedule(subjectID) {
    return scheduleObject.filter(({ SubjectID }) => SubjectID === subjectID)
}

function groupSubjectSchedule(classArray) {
    for (let i = 0; i < classArray.length; i++) {
        if (classArray[i].ClassID.includes('_LT')) {
            return filterClassIDWithLT(classArray);
        }
    }
    return filterClassID(classArray);

}

function filterClassID(classArray) {

    //*Filter class with classID without BT_LT
    let result = [];
    let idArray = [];
    for (let i = 0; i < classArray.length; i++) {
        if (idArray.indexOf(classArray[i].ClassID) < 0) {
            idArray.push(classArray[i].ClassID);
        }
    }
    console.log(idArray);
    for (let i = 0; i < idArray.length; i++) {
        result[i] = classArray.filter(({ ClassID }) => ClassID === idArray[i]);
    }
    if (userInfo.Role == 3) {
        return onloadClassList(result);
    } else {
        return onloadClassListAdmin(result);
    }
}

function filterClassIDWithLT(classArray) {
    //Filter classID with BT_LT 
    let result = [];
    let idArray = [];
    let idArray_2 = [];
    for (let i = 0; i < classArray.length; i++) {
        if (idArray.indexOf(classArray[i].ClassID) < 0 && classArray[i].ClassID.includes('_LT')) {
            let _string = classArray[i].ClassID.slice(0, classArray[i].ClassID.indexOf('_'));
            console.log(_string);
            idArray.push(_string);
        }
    }
    console.log(idArray);
    for (let i = 0; i < classArray.length; i++) {
        if (idArray_2.indexOf(classArray[i].ClassID) < 0 && classArray[i].ClassID.includes('_BT')) {
            idArray_2.push(classArray[i].ClassID);
        }
    }
    console.log(idArray_2);
    for (let i = 0; i < idArray.length; i++) {
        for (let j = 0; j < idArray_2.length; j++) {
            if (idArray_2[j].includes(idArray[i])) {
                let tempArray1 = classArray.filter(({ ClassID }) => ClassID === idArray_2[j]);
                let tempArray2 = classArray.filter(({ ClassID }) => ClassID.includes(idArray[i] + '_LT'));
                result[j] = tempArray1.concat(tempArray2);
            }
        }
    }
    if (userInfo.Role == 3) {
        return onloadClassList(result);
    } else {
        return onloadClassListAdmin(result);
    }
}

function generateStudentSemesterArray() {
    let array = [];
    console.log(studentInfo.Schedule);
    array = Object.keys(studentInfo.Schedule);
    console.log(array);
    let select = document.getElementById('StudentSemesterSelect');
    select.innerHTML = "<option value=" + 0 + ">Chon hoc ky</option>";
    for (let i = 0; i < array.length; i++) {
        let opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select.appendChild(opt);
    }
    openStudentScheduleTab();
}

function generateStudentSchedule(SemesterID) {
    let studentSchedule = []
    if (studentInfo.Schedule !== undefined && studentInfo.Schedule[SemesterID] !== undefined) {
        studentSchedule = Object.keys(studentInfo.Schedule[SemesterID]).map((o) => studentInfo.Schedule[SemesterID][o]);
    } else {}
    let scheduleRes = JSON.parse(schedule);
    let result = [];
    for (let i = 0; i < studentSchedule.length; i++) {
        let temp = scheduleRes[studentSchedule[i]];
        delete temp.MaxStudents;
        delete temp.StudentsList;
        result.push(temp);
    }
    return result;
}


function getStudentSchedule(SemesterID) {
    hideAllTab();
    document.getElementById("StudentSchedule").style.display = "inline-block";
    document.getElementById("ExportStudentSchedule").style.display = "inline-block";
    showStudentSchedule(generateStudentSchedule(SemesterID));
}

function showStudentSchedule(result) {
    buildHtmlTable("#studentschedule", result);
    $('#studentschedule').show();
}

function showTable(result) {
    buildHtmlTable("#datatable", result);
    $('#datatable').show();
}

function subjectEnrollment() {
    //Enroll with classID and save to Student table and schedule table
    if ($("#SubjectList").children("option:selected").val().toString() !== 'null') {
        let studentSchedule = generateStudentSchedule('HK2_N2_2019');
        let scheduleJSON = JSON.parse(schedule);
        let classArray = $("#SubjectList").children("option:selected").val().toString().split('/');
        for (let i = 0; i < classArray.length; i++) {
            let item = scheduleJSON[classArray[i].split('.').join('-')];
            let shiffStart = item.Shiff.split('-')[0];
            let shiffEnd = item.Shiff.split('-')[1];
            let classWithSameDay = studentSchedule.filter(({ Day }) => Day === item.Day);
            for (let j = 0; j < classWithSameDay.length; j++) {
                //Filter class in same day
                let start = classWithSameDay[j].Shiff.split('-')[0];
                let end = classWithSameDay[j].Shiff.split('-')[1];
                if ((start >= shiffStart && start <= shiffEnd) || (end >= shiffStart && end <= shiffEnd)) {
                    alert('You have a class in this time please choose another');
                    return;
                }
            }
            if (studentSchedule.findIndex(({ SubjectID }) => SubjectID === item.SubjectID) !== -1) {
                alert('You have already enroll this class');
                return;
            }
        }
        let requestbody = new enrollObject(studentInfo.StudentID, classArray, 'HK2_N2_2019');
        let enrollUrl = 'https://subjectregister.firebaseapp.com/api/v1/student/enroll';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', enrollUrl, false);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(requestbody));
        if (xmlhttp.responseText == 'Complete') {
            studentInfo = getUserInfo();
            openRegisterTab();
            window.alert('Enroll class successful');
            closeForm();
        } else {
            window.alert('There is an error please try again');
        }
    } else {
        alert('This class is full please choose another');
    }
}

function cancelClass(classID) {
    let idArray = classID.split('.').join('-').split('/');
    console.log(idArray);
    let requestbody = new cancelObject(studentInfo.StudentID, idArray, 'HK2_N2_2019');
    console.log(requestbody);
    let cancelUrl = 'https://subjectregister.firebaseapp.com/api/v1/student/cancel';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', cancelUrl, false);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(requestbody));
    if (xmlhttp.responseText == 'Complete') {
        studentInfo = getUserInfo();
        openRegisterTab();
        window.alert('Cancel class successful');
        closeForm();
    } else {
        window.alert('There is an error please try again');
    }
}

function cancelObject(studentID, classID, semesterID) {
    this.studentID = studentID;
    this.classID = classID;
    this.semesterID = semesterID;
}

function enrollObject(studentID, classID, semesterID) {
    this.studentID = studentID;
    this.classID = classID;
    this.semesterID = semesterID;
}

function snapshotToArray(snapshot) {
    var temp = JSON.parse(snapshot);
    var result = Object.keys(temp).map((o) => temp[o]);

    return result;
};