function exportStudentSchedule() {
    let semesterID = $('#StudentSemesterSelect').children("option:selected").val();
    let scheduleArray = generateStudentSchedule(semesterID);
    for (let i = 0; i < scheduleArray.length; i++) {
        delete scheduleArray[i].ClassID;
    }
    let propertyArray = Object.keys(scheduleArray[0]);
    let result = [];
    let doc = new jsPDF();
    scheduleArray.forEach(elem => {
        let temp = [elem.Day, elem.Room, elem.Shiff, elem.SubjectID, elem.SubjectName, elem.TeacherID];
        result.push(temp);
    });
    doc.setFont('Amiri');
    doc.autoTable(propertyArray, result, { startY: 10, lang: 'vi' });
    doc.save('ThoiKhoaBieu' + semesterID + '.pdf');
}

function exportLecturerScheduleAdmin(LecturerID, SemesterID) {
    if (SemesterID == 0 || LecturerID == '') {
        window.alert('Ma giang vien hoac hoc ky khong hop le vui long nhap lai.');
    } else {
        let arrayData = getLecturerSchedule(LecturerID, SemesterID);
        for (let i = 0; i < arrayData.length; i++) {
            delete arrayData[i].ClassID;
            delete arrayData[i].MaxStudents;
            delete arrayData[i].SubjectID;
            if (arrayData[i].StudentsList == undefined) {
                arrayData[i].StudentsList = [];
            } else {
                arrayData[i].StudentsList = Object.keys(arrayData[i].StudentsList).map((o) => arrayData[i].StudentsList[o]);
            }
        }
        let propertyArray = Object.keys(arrayData[0]);
        let result = [];
        let doc = new jsPDF();
        arrayData.forEach(elem => {
            let temp = [];
            for (let i = 0; i < propertyArray.length; i++) {
                temp[i] = elem[propertyArray[i]];
            }
            result.push(temp);
        });
        doc.setFont('Amiri');
        doc.autoTable(propertyArray, result, { startY: 10, lang: 'vi' });
        doc.save('LichDayGiaoVien' + SemesterID + '-' + LecturerID + '.pdf');
    }
}

function exportLecturerSchedule(SemesterID) {
    if (SemesterID == 0) {
        window.alert('Ma giang vien hoac hoc ky khong hop le vui long nhap lai.');
    } else {
        let arrayData = getLecturerSchedule(userInfo.UserName, SemesterID);
        for (let i = 0; i < arrayData.length; i++) {
            delete arrayData[i].ClassID;
            delete arrayData[i].MaxStudents;
            delete arrayData[i].SubjectID;
            if (arrayData[i].StudentsList == undefined) {
                arrayData[i].StudentsList = [];
            } else {
                arrayData[i].StudentsList = Object.keys(arrayData[i].StudentsList).map((o) => arrayData[i].StudentsList[o]);
            }
        }
        let propertyArray = Object.keys(arrayData[0]);
        let result = [];
        let doc = new jsPDF();
        arrayData.forEach(elem => {
            let temp = [];
            for (let i = 0; i < propertyArray.length; i++) {
                temp[i] = elem[propertyArray[i]];
            }
            result.push(temp);
        });
        doc.setFont('Amiri');
        doc.autoTable(propertyArray, result, { startY: 10, lang: 'vi' });
        doc.save('LichDayGiaoVien' + SemesterID + '-' + userInfo.UserName + '.pdf');
    }
}

function exportClassroom(SemesterID) {
    if (SemesterID == 0) {
        window.alert('Vui long chon hoc ky');
    } else {
        let arrayData = snapshotToArray(getSchedule(SemesterID));
        for (let i = 0; i < arrayData.length; i++) {
            delete arrayData[i].ClassID;
            delete arrayData[i].MaxStudents;
            delete arrayData[i].SubjectID;
            if (arrayData[i].StudentsList == undefined) {
                arrayData[i].StudentsList = [];
            } else {
                arrayData[i].StudentsList = Object.keys(arrayData[i].StudentsList).map((o) => arrayData[i].StudentsList[o]);
            }
        }
        let propertyArray = Object.keys(arrayData[0]);
        let result = [];
        let doc = new jsPDF();
        arrayData.forEach(elem => {
            let temp = [];
            for (let i = 0; i < propertyArray.length; i++) {
                temp[i] = elem[propertyArray[i]];
            }
            result.push(temp);
        });
        doc.setFont('Amiri');
        doc.autoTable(propertyArray, result, { startY: 10, lang: 'vi' });
        doc.save('DanhSachLop' + SemesterID + '.pdf');
    }
}