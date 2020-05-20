const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.getdivision=async (request,response)=>{
    var divisionID=request.params.divisionID.toString().toUpperCase();
    var result=await manager.admin.database().ref('/Division').child('/'+divisionID).once('value');
    response.status(200).send(JSON.stringify(result))
}
exports.newdivision=async (request,response)=>{
    let object=JSON.parse(JSON.stringify(request.body));
    var divisionID=object.DivisionID;
    await manager.admin.database().ref('/Division').child('/'+divisionID).set(request.body).then(()=>response.status(200).send('Post new division complete'));
}
exports.deletedivision=async (request,response)=>{
    var divisionID=request.params.divisionID.toString().toUpperCase();
    await manager.admin.database().ref('/Division').child('/'+divisionID).remove().then(()=>response.status(200).send('Delete division with id '+divisionID));
}