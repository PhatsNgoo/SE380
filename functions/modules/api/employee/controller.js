const manager = require('../../../manager');
const utility = require('../../common/utility');

exports.getemployee=async (request,response)=>{
    var employeeID=request.params.employeeID.toString().toUpperCase();
    var result=await manager.admin.database().ref('/Employee').child('/'+employeeID).once('value');
    response.status(200).send(JSON.stringify(result));
}
exports.newemployee=async (request,response)=>{
    let object=JSON.parse(JSON.stringify(request.body));
    var employeeID=object.EmployeeID;
    await manager.admin.database().ref('/Employee').child('/'+employeeID).set(request.body).then(()=>response.status(200).send('Post new employee complete'));
}
exports.deleteemployee=async (request,response)=>{
    var employeeID=request.params.employeeID.toString().toUpperCase();
    await manager.admin.database().ref('/Employee').child('/'+employeeID).remove().then(()=>response.status(200).send('Delete employee with id '+employeeID));
}