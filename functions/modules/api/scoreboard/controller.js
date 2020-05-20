const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.getscoreboard=async (request,response)=>{
    let studentID=request.params.studentID.toString().toUpperCase();
    let dataSnapshot=await manager.admin.database().ref('/Scoreboard').child('/'+studentID).once('value');
    let subject=await manager.admin.database().ref('/Subject').once('value');
    let result=[];
    let subjectArray=utility.snapshotToArray(subject);
    let scoreboardArray=utility.snapshotToArray(dataSnapshot);
    for (let i=0;i<scoreboardArray.length;i++){
        let temp=subjectArray.find(({SubjectID})=>SubjectID===scoreboardArray[i].SubjectID.slice(0,5));
        if (temp!=null){
            temp.Score=scoreboardArray[i].Score;
            temp.Time=scoreboardArray[i].Time;
            delete temp.key;
            result.push(temp);
        }
        else {
            console.log('Subject is nullified with subjectid: '+scoreboardArray[i].SubjectID.slice(0,5));
        }
    }
    response.send(JSON.stringify(result));
}
exports.getallscroreboard=async (request,response)=>{
    var dataSnapshot=await manager.admin.database().ref('/Scoreboard').once('value');
    let result=[];
    dataSnapshot.forEach(function (childSnapshot) {
        result.push(childSnapshot.key);
    });
    response.send(JSON.stringify(result));
}
exports.scoreboard=async (request,response)=>{
    await manager.admin.database().ref('/Scoreboard').set(request.body);
    response.status(200).send('status code 200 update scoreboard complete');
}
exports.deletescoreboard=async (request,response)=>{
    let studentID=request.params.studentID.toString().toUpperCase();
    await manager.admin.database().ref('/Scoreboard').child('/'+studentID).remove().then(()=>response.status(200).send('Delete score board of student with id '+studentID));
}