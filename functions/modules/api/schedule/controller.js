const manager = require('../../../manager');
const bodyParser = require('body-parser');
const utility = require('../../common/utility');
exports.getallschedule=async (request,response)=>{
    var dataSnapshot= await manager.admin.database().ref('/Schedule').once('value');
    let result=[];
    dataSnapshot.forEach(function (childSnapshot) {
        result.push(childSnapshot.key);
    });
    response.send(JSON.stringify(result));
}
exports.getschedule=async (request,response)=>{
    var semester=request.params.semesterID.toString().toUpperCase();
    var dataSnapshot= await manager.admin.database().ref('/Schedule').child('/'+semester).once('value');
    response.send(JSON.stringify(dataSnapshot));
}
exports.getsubjectclass=async (request,response)=>{
    var semester=request.params.semesterID.toString().toUpperCase();
    var subjectID=request.params.subjectID.toString().toUpperCase();
    var dataSnapshot=await manager.admin.database().ref('/Schedule').child('/'+semester).on('value',function (snapshot) {
        var array=utility.snapshotToArray(snapshot);
        var result=array.filter(({SubjectID})=>SubjectID===subjectID);
        response.send(result);
    });
}
exports.getsubjectbycurriculum=async (request,response)=>{

}
exports.deleteschedule=async (request,response)=>{
    var semesterID=request.params.semesterID.toString().toUpperCase();
    await manager.admin.database().ref('/Schedule').child('/'+semesterID).remove().then(()=>response.status(200).send('Delete schedule for semester '+semesterID))
}
exports.importschedule=async (request,response)=>{
    //console.log(request.body);
    var semester=request.params.semesterID.toString().toUpperCase();
    const addSchedule=await manager.admin.database().ref('/Schedule').child('/'+semester).set(request.body);
    //convert new schedule here
    response.send('Import new schedule done');
}

