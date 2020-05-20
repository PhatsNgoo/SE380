var isLoggedIn = false;
var registing = false;
var userInfo = localStorage['UserInfo'] != null ? JSON.parse(localStorage['UserInfo']) : null;

function GetData(data) {
    var request = new XMLHttpRequest()
    var url = 'https://subjectregister.firebaseapp.com/api/v1';
    switch (data) {
        case 'Schedule':
            if (userInfo.Role == 2) {
                showLecturerSchedule($("#ScheduleSelect").children("option:selected").val().toString());
                return;
            } else {
                url = url + '/schedule/' + $("#ScheduleSelect").children("option:selected").val().toString();
            }
            break;
        case 'Scoreboard':
            url = url + '/scoreboard/' + userInfo.UserName;
            break;
        case 'Curriculum':
            url = url + '/curriculum/' + $("#CurriculumSelect").children("option:selected").val().toString();
            break;
    }
    request.open('GET', url, true)
    request.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.responseText)
        var newArrayDataOfOjbect = Object.values(data)
        buildHtmlTable("#datatable", newArrayDataOfOjbect)
    }
    $('#datatable').show();
    request.send()

}

function ExportToTable() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/
    if (regex.test($("#ExcelFile").val().toLowerCase())) {
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#ExcelFile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;
                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    console.log(cnt);
                    console.log(sheet_name_list[cnt]);
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        console.log(exceljson);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        console.log(exceljson);
                    }
                    var url = 'https://subjectregister.firebaseapp.com/api/v1';
                    switch (sheet_name_list[cnt]) {
                        case "Schedule":
                            url = url + '/schedule/hk2_n2_2019/import'
                            break;
                        case "Scoreboard":
                            url = url + '/scoreboard/'
                            break;
                        case "Curriculum":
                            url = url + '/curriculum/'
                            break;
                    }
                    if (sheet_name_list[cnt] === 'Schedule') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        for (let i = 0; i < array.length; i++) {
                            result[array[i].ClassID.split('.').join('-')] = array[i];
                        }
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json')
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    } else if (sheet_name_list[cnt] === 'Scoreboard') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        var idArray = [];
                        for (let i = 0; i < array.length; i++) {
                            if (idArray.indexOf(array[i].StudentID) >= 0) {} else {
                                idArray.push(array[i].StudentID);
                            }
                        }
                        for (let i = 0; i < idArray.length; i++) {
                            var studentScoreboard = array.filter(({ StudentID }) => StudentID === idArray[i]);
                            result[idArray[i]] = studentScoreboard;
                        }
                        console.log(JSON.stringify(result));
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json')
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    } else if (sheet_name_list[cnt] === 'Curriculum') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        for (let i = 0; i < array.length; i++) {
                            result[array[i].MajorID] = array[i];
                        }
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json')
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    }
                    if (exceljson.length > 0) {
                        BindTable(exceljson, '#exceltable' + cnt.toString());
                        cnt++;
                    }

                });
                $('#exceltable' + cnt.toString()).show();
            }
            if (xlsxflag) { /*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#ExcelFile")[0].files[0]);
            } else {
                reader.readAsBinaryString($("#ExcelFile")[0].files[0]);
            }
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        alert("Please upload a valid Excel file!");
    }
}

function BindTable(jsondata, tableid) { /*Function used to convert the JSON array to Html Table*/
    var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/
    for (var i = 0; i < jsondata.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = jsondata[i][columns[colIndex]];
            if (cellValue == null)
                cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(tableid).append(row$);
    }
}

function BindTableHeader(jsondata, tableid) { /*Function used to get all column names from JSON and bind the html table header*/
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0; i < jsondata.length; i++) {
        var rowHash = jsondata[i];
        for (var key in rowHash) {
            if (rowHash.hasOwnProperty(key)) {
                if ($.inArray(key, columnSet) == -1) { /*Adding each unique column names to a variable array*/
                    columnSet.push(key);
                    headerTr$.append($('<th/>').html(key));
                }
            }
        }
    }
    $(tableid).append(headerTr$);
    return columnSet;
}

function RemoveTable(tableid) {
    $(tableid).empty();
}

//___________________________________________________________________________________________________
// Builds the HTML Table out of myList.
function buildHtmlTable(selector, data) {

    var columns = addAllColumnHeaders(data, selector);

    for (var i = 0; i < data.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = data[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            if (registing && colIndex == columns.length - 1) {
                if (data[i].isRegisted === true) {
                    row$.append($('<button onclick="openCancelEnrollForm(' + "'" + data[i].ClassID + "'" + ')">Hủy</button><td/>'));
                } else {

                    row$.append($('<button onclick="openRegisterForm(' + "'" + data[i].SubjectID + "'" + ')">Đăng ký</button><td/>'));
                }
            } else {
                row$.append($('<td/>').html(cellValue));
            }
        }
        $(selector).append(row$);
    }
    if (registing) {
        registing = false;
    }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(data, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0; i < data.length; i++) {
        var rowHash = data[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                if (key !== 'key' && key !== 'isRegisted' && key !== 'ClassID' && key !== 'StudentsList' && key !== 'MaxStudents') {
                    columnSet.push(key);
                    headerTr$.append($('<th/>').html(key));
                }
            }
        }
    }
    if (registing) {
        columnSet.push('Đăng ký');
        headerTr$.append($('<th/>').html('Đăng ký'));
    }
    $(selector).append(headerTr$);

    return columnSet;
}

function openScheduleForm() {
    document.getElementById("scheduleForm").style.display = "block";
}

function openScoreboardForm() {
    document.getElementById("scoreboardForm").style.display = "block";
}

function openCurriculumForm() {
    document.getElementById("curriculumForm").style.display = "block";
}


function importSchedule() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/
    if (regex.test($("#ScheduleFile").val().toLowerCase())) {
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#ScheduleFile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;
                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    console.log(cnt);
                    console.log(sheet_name_list[cnt]);
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        console.log(exceljson);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        console.log(exceljson);
                    }
                    var url = 'https://subjectregister.firebaseapp.com/api/v1';
                    var semesterID = 'hk' + $("#semester").children("option:selected").val().toString() + '_n' + $("#group").children("option:selected").val().toString() + '_' + $("#year").children("option:selected").val().toString();
                    console.log(semesterID);
                    switch (sheet_name_list[cnt]) {
                        case "Schedule":
                            url = url + '/schedule/' + semesterID + '/import'
                            break;
                    }
                    if (sheet_name_list[cnt] === 'Schedule') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        for (let i = 0; i < array.length; i++) {
                            result[array[i].ClassID.split('.').join('-') + '-D' + array[i].Day + '-S' + array[i].Shiff] = array[i];
                        }
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json');
                        xmlhttp.onload = () => {
                            document.getElementById("scheduleForm").style.display = "none";
                            document.getElementById("scoreboardForm").style.display = "none";
                            document.getElementById("curriculumForm").style.display = "none";
                            window.alert('Update new schedule complete');
                        };
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    }
                    if (exceljson.length > 0) {
                        BindTable(exceljson, '#exceltable' + cnt.toString());
                        cnt++;
                    }

                });
                $('#exceltable' + cnt.toString()).show();
            }
            if (xlsxflag) { /*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#ScheduleFile")[0].files[0]);
            } else {
                reader.readAsBinaryString($("#ScheduleFile")[0].files[0]);
            }
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        window.alert('Invalid excel file');
    }
}

function importScoreBoard() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/
    if (regex.test($("#ScoreboardFile").val().toLowerCase())) {
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#ScoreboardFile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;
                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    console.log(cnt);
                    console.log(sheet_name_list[cnt]);
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        console.log(exceljson);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        console.log(exceljson);
                    }
                    var url = 'https://subjectregister.firebaseapp.com/api/v1';
                    switch (sheet_name_list[cnt]) {
                        case "Scoreboard":
                            url = url + '/scoreboard/'
                            break;
                    }
                    if (sheet_name_list[cnt] === 'Scoreboard') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        var idArray = [];
                        for (let i = 0; i < array.length; i++) {
                            if (idArray.indexOf(array[i].StudentID) >= 0) {} else {
                                idArray.push(array[i].StudentID);
                            }
                        }
                        for (let i = 0; i < idArray.length; i++) {
                            var studentScoreboard = array.filter(({ StudentID }) => StudentID === idArray[i]);
                            result[idArray[i]] = studentScoreboard;
                        }
                        console.log(JSON.stringify(result));
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json');
                        xmlhttp.onload = () => {
                            document.getElementById("scheduleForm").style.display = "none";
                            document.getElementById("scoreboardForm").style.display = "none";
                            document.getElementById("curriculumForm").style.display = "none";
                            window.alert('Update new scoreboard complete');
                        };
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    }
                    if (exceljson.length > 0) {
                        BindTable(exceljson, '#exceltable' + cnt.toString());
                        cnt++;
                    }

                });
                $('#exceltable' + cnt.toString()).show();
            }
            if (xlsxflag) { /*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#ScoreboardFile")[0].files[0]);
            } else {
                reader.readAsBinaryString($("#ScoreboardFile")[0].files[0]);
            }
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        window.alert('Invalid excel file');
    }

}


function importCurriculum() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    /*Checks whether the file is a valid excel file*/
    if (regex.test($("#CurriculumFile").val().toLowerCase())) {
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#CurriculumFile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        /*Checks whether the browser supports HTML5*/
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                } else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;
                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function(y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    console.log(cnt);
                    console.log(sheet_name_list[cnt]);
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        console.log(exceljson);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        console.log(exceljson);
                    }
                    var url = 'https://subjectregister.firebaseapp.com/api/v1';
                    switch (sheet_name_list[cnt]) {
                        case "Curriculum":
                            url = url + '/curriculum/'
                            break;
                    }
                    if (sheet_name_list[cnt] === 'Curriculum') {
                        console.log(exceljson);
                        result = {};
                        var array = exceljson;
                        console.log(array.length);
                        for (let i = 0; i < array.length; i++) {
                            result[array[i].MajorID] = array[i];
                        }
                        var xmlhttp = new XMLHttpRequest()
                        xmlhttp.open('POST', url, false)
                        xmlhttp.setRequestHeader('Content-Type', 'application/json');
                        xmlhttp.onload = () => {
                            document.getElementById("scheduleForm").style.display = "none";
                            document.getElementById("scoreboardForm").style.display = "none";
                            document.getElementById("curriculumForm").style.display = "none";
                            window.alert('Update new curriculum complete');
                        };
                        xmlhttp.send(JSON.stringify(result));
                        if (xmlhttp.status != 200) {
                            //Handle error here
                        } else {
                            //complete import new schedule
                        }
                    }
                    if (exceljson.length > 0) {
                        BindTable(exceljson, '#exceltable' + cnt.toString());
                        cnt++;
                    }

                });
                $('#exceltable' + cnt.toString()).show();
            }
            if (xlsxflag) { /*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#CurriculumFile")[0].files[0]);
            } else {
                reader.readAsBinaryString($("#CurriculumFile")[0].files[0]);
            }
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        window.alert('Invalid excel file');
    }

}

function closeForm() {
    document.getElementById("scheduleForm").style.display = "none";
    document.getElementById("scoreboardForm").style.display = "none";
    document.getElementById("curriculumForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("cancelEnrollForm").style.display = "none";
    document.getElementById("cancelForceEnrollConfirm").style.display = "none";
    document.getElementById("forceEnrollForm").style.display = "none";
    document.getElementById("cancelForceEnrollForm").style.display = "none";
    document.getElementById("isNotInTimeToEnroll").style.display = "none";
}

function verifyAccount() {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/user/login';
    const { username, password } = '';
    const userAccount = { username, password };
    userAccount.username = $("#Username").val().toString();
    userAccount.password = $("#Password").val().toString();
    console.log(JSON.stringify(userAccount));
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, false);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(userAccount));
    console.log(xmlhttp.responseText);
    if (xmlhttp.responseText === 'true') {
        console.log('Line 509');
        logIn(userAccount.username);
    } else {
        console.log('Line 510');
    }
}

function logIn(username) {
    let url = 'https://subjectregister.firebaseapp.com/api/v1/user/' + username;
    localStorage['Username'] = username;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    console.log(xmlhttp.responseText);
    userInfo = JSON.parse(xmlhttp.responseText);
    localStorage['UserInfo'] = xmlhttp.responseText;
    console.log(userInfo);
    location.replace('./index.html');
}


function logOut() {
    localStorage.removeItem('Username');
    localStorage.removeItem('UserInfo');
    location.replace('./login.html');
}