const manager = require('../../../manager');
const utility = require('../../common/utility');
exports.getsubject = async(request, response) => {
    var subjectID = request.params.subjectID.toString().toUpperCase();
    var dataSnapshot=await manager.admin.database().ref('/Subject').child('/'+subjectID).once('value')
    response.send(JSON.stringify(dataSnapshot));
};
exports.getallsubject = async(request, response) => {
    var dataSnapshot=await manager.admin.database().ref('/Subject').once('value');
    response.send(JSON.stringify(dataSnapshot));
};
exports.deletesubject=async (request,response)=>{
    var subjectID=request.params.subjectID.toString().toUpperCase();
    await manager.admin.database().ref('/Subject').child('/'+subjectID).remove().then(()=>response.status(200).send('Delete subject with id '+subjectID));
}
exports.newsubject=async (request,response)=>{
    let object=JSON.parse(JSON.stringify(request.body));
    let subjectID=object.SubjectID;
    await manager.admin.database().ref('/Subject').child('/'+subjectID).set(request.body).then(()=>response.status(200).send('Post new subject complete '+subjectID));
}