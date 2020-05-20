const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.gettallcalendar=async (request,response)=>{
    var dataSnapshot=await manager.admin.database().ref('/Calendar').once('value')
    response.send(JSON.stringify(dataSnapshot));
}
exports.getcalendar=async (request,response)=>{
    var semesterID = request.params.semesterID.toString().toUpperCase();
    var dataSnapshot=await manager.admin.database().ref('/Calendar').child('/'+semesterID).once('value')
    response.send(JSON.stringify(dataSnapshot));
}
exports.newcalendar=async (request,response)=>{

}
exports.editcalendar=async (request,response)=>{

}
exports.deletecalendar=async (request,response)=>{
    var semesterID=request.params.semesterID.toString().toUpperCase();
    await manager.admin.database().ref('/Calendar').child('/'+semesterID).remove().then(()=>response.status(200).send('Delete calendar for semester '+semesterID));
}