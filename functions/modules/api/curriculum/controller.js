const manager=require('../../../manager');
const utility = require('../../common/utility');
exports.getcurriculum=async (request,response)=>{
    let id=request.params.majorID.toString().toUpperCase();
    const dataSnapshot=await manager.admin.database().ref('/Curriculum').child('/'+id).once('value');
    let object=JSON.parse(JSON.stringify(dataSnapshot))
    const subjectSnapshot=await manager.admin.database().ref('/Subject').once('value');
    let result=getdata(object,subjectSnapshot);
    console.log(result);
    response.send(JSON.stringify(result));
}
exports.newcurriculum= async (request,response)=>{
    await manager.admin.database().ref('/Curriculum').set(request.body).then(()=>response.status(200).send('Post new curriculum complete'));
}
exports.deletecurriculum=async (request,response)=>{
    let curriculumID=request.params.majorID;
    await manager.admin.database().ref('/Curriculum').remove().then(()=>response.status(200).send('Delete curriculum with curriculumID '+curriculumID));
}
function getdata(object,subjectSnapshot) {
    let freeSelection=object.FreeSelection.toString().split(';');
    let graduateSubject=object.GraduateSubjects.toString().split(';');
    let generalSubject=object.GeneralSubjects.toString().split(';');
    let majorSubject=object.MajorSubjects.toString().split(';');
    var subjectList=utility.snapshotToArray(subjectSnapshot);
    let result=[];
    for (let i=0;i<generalSubject.length;i++){
        let subject=subjectList.find(({SubjectID})=>SubjectID===generalSubject[i])
        if(subject!=null){
            result.push(subject);
        }
        else {
            console.log('Subject is nullified');
        }
    }
    for (let i=0;i<majorSubject.length;i++){
        let subject=subjectList.find(({SubjectID})=>SubjectID===majorSubject[i])
        if(subject!=null){
            result.push(subject);
        }
        else {
            console.log('Subject is nullified');
        }
    }
    for (let i=0;i<graduateSubject.length;i++){
        let subject=subjectList.find(({SubjectID})=>SubjectID===graduateSubject[i])
        if(subject!=null){
            result.push(subject);
        }
        else {
            console.log('Subject is nullified');
        }
    }
    for (let i=0;i<freeSelection.length;i++){
        let subject=subjectList.find(({SubjectID})=>SubjectID===freeSelection[i])
        if(subject!=null){
            result.push(subject);
        }
        else {
            console.log('Subject is nullified');
        }
    }
    console.log(result);
    return result;
}