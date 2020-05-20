const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.getstudent=async (request,response)=>{
    var studentID=request.params.studentID.toString().toUpperCase();
    var result=await manager.admin.database().ref('/Students').child('/'+studentID).once('value');
    response.status(200).send(JSON.stringify(result));
}
exports.getallstudent=async (request,response)=>{
    var result=await manager.admin.database().ref('/Students').once('value');
    response.status(200).send(JSON.stringify(result));
}
exports.newstudent=async (request,response)=>{
    let object=JSON.parse(JSON.stringify(request.body));
    var studentID=object.StudentID;
    await manager.admin.database().ref('/Students').child('/'+studentID).set(request.body).then(()=>response.status(200).send('Post new student complete'));
}
exports.deletestudent=async (request,response)=>{
    var studentID=request.params.studentID.toString().toUpperCase();
    await manager.admin.database().ref('/Students').child('/'+studentID).remove().then(()=>response.status(200).send('Delete student with id '+studentID));
}
exports.enrollClass=async (request,response)=>{
    const { studentID,classID,semesterID}=request.body;
    const object={
        studentID,
        classID,
        semesterID
    }
    for (let i=0;i<object.classID.length;i++){
        await manager.admin.database().ref('/Students').child('/'+object.studentID).child('/Schedule').child('/'+object.semesterID+'/'+object.classID[i].split('.').join('-')).set(object.classID[i].split('.').join('-'));
        await manager.admin.database().ref('/Schedule').child('/'+object.semesterID).child('/'+object.classID[i].split('.').join('-')+'/StudentsList/'+object.studentID).set(object.studentID);
    }
    response.status(200).send('Complete');
}
exports.cancelClass=async (request,response)=>{
    const { studentID,classID,semesterID}=request.body;
    const object={
        studentID,
        classID,
        semesterID
    }
    for(let i=0;i<object.classID.length;i++){
        await manager.admin.database().ref('/Students').child('/'+object.studentID).child('/Schedule').child('/'+object.semesterID+'/'+object.classID[i].split('.').join('-')).remove();
        await manager.admin.database().ref('/Schedule').child('/'+object.semesterID).child('/'+object.classID[i].split('.').join('-')+'/StudentsList/'+object.studentID).remove();
    }
    response.status(200).send('Complete');
}