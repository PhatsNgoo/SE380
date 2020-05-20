function showLecturerSchedule(SemesterID) {
    let semesterSchedule = snapshotToArray(getSchedule(SemesterID));
    let lecturerSchedule = semesterSchedule.filter(({ TeacherID }) => TeacherID === userInfo.UserName);
    console.log(lecturerSchedule);

    let splitSchedule = [2, 3, 4, 5, 6, 7, 1];
    for (let i = 0; i < splitSchedule.length; i++) {
        splitSchedule[i] = lecturerSchedule.filter(({ Day }) => Day == splitSchedule[i]);
        for (let j = 0; j < splitSchedule[i].length; j++) {
            splitSchedule[i][j].ShiffStart = splitSchedule[i][j].Shiff.split('-')[0];
            splitSchedule[i][j].ShiffEnd = splitSchedule[i][j].Shiff.split('-')[1];
        }
    }
    buildLecturerSchedule(splitSchedule);
}

function getLecturerSchedule(LecturerID, SemesterID) {
    let semesterSchedule = snapshotToArray(getSchedule(SemesterID));
    let lecturerSchedule = semesterSchedule.filter(({ TeacherID }) => TeacherID === LecturerID);
    return lecturerSchedule;
}

function buildLecturerSchedule(schedule) {
    document.getElementById('lecturerschedule').innerHTML = '<tr><th>Shiff</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th></tr><tr id="firstShiff"><td>1</td></tr><tr id="secondShiff"><td>2</td></tr><tr id="thirdShiff"><td>3</td></tr><tr id="fourthShiff"><td>4</td></tr><tr id="fifthShiff"><td>5</td></tr><tr id="sixthShiff"><td>6</td></tr><tr id="seventhShiff"><td>7</td></tr><tr id="eigthShiff"><td>8</td></tr><tr id="ninethShiff"><td>9</td></tr><tr id="tenthShiff"><td>10</td></tr>';
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

function showLecturerScheduleWithID(LecturerID, SemesterID) {
    let semesterSchedule = snapshotToArray(getSchedule(SemesterID));
    let lecturerSchedule = semesterSchedule.filter(({ TeacherID }) => TeacherID === LecturerID);
    console.log(lecturerSchedule);

    let splitSchedule = [2, 3, 4, 5, 6, 7, 1];
    for (let i = 0; i < splitSchedule.length; i++) {
        splitSchedule[i] = lecturerSchedule.filter(({ Day }) => Day == splitSchedule[i]);
        for (let j = 0; j < splitSchedule[i].length; j++) {
            splitSchedule[i][j].ShiffStart = splitSchedule[i][j].Shiff.split('-')[0];
            splitSchedule[i][j].ShiffEnd = splitSchedule[i][j].Shiff.split('-')[1];
        }
    }
    buildLecturerSchedule(splitSchedule);
}