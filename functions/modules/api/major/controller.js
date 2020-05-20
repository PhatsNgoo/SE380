const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.getmajor=async (request,response)=>{
    var majorID=request.params.majorID.toString().toUpperCase();
    var result=await manager.admin.database().ref('/Major').child('/'+majorID).once('value');
    response.status(200).send(JSON.stringify(result));
}
exports.newmajor=async (request,response)=>{
    let object=JSON.parse(JSON.stringify(request.body));
    var MajorID=object.MajorID;
    await manager.admin.database().ref('/Major').child('/'+MajorID).set(request.body).then(()=>response.status(200).send('Post new major complete'));
}
exports.deletemajor=async (request,response)=>{
    var majorID=request.params.majorID.toString().toUpperCase();
    await manager.admin.database().ref('/Major').child('/'+majorID).remove().then(()=>response.status(200).send('Delete major with id '+majorID));
}