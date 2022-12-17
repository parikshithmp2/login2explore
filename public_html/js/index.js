/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projDBName = "PROJECT-TABLE";
var projRelationName = "COLLEGE-DB";
var connToken = "90937510|-31949291470384670|90942875"

$("#projid").focus();

function saveRecNo2LS(jsonobj){
    var lvData = JSON.parse(jsonobj.data);
    localStorage,setItem("recno", lvData.rec_no);
}

function getProjIdAsJsonObj(){
    var projid = $("#projid").val();
    var jsonStr ={
        id:projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#projname").val(record.name);
    $("#projto").val(record.assignedto);
    $("#projDate").val(record.assignmentdate);
    $("#projDeadline").val(record.deadline);
}

function resetForm(){
    $("#projid").val("");
    $("#projname").val("");
    $("#projto").val("");
    $("#projdate").val("");
    $("#projdeadline").val("");
    $("#projid").prop("disabled",false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projid").focus();
}

function validateData(){
    var projid, projname, projto, projdate, projdeadline;
    projid = $("#projid").val();
    projname = $("#projname").val();
    projto = $("#projto").val();
    projdate = $("#projdate").val();
    projdeadline = $("#projdeadline").val();
    
    if(projid === ""){
        alert("Project ID missing");
        $("#projid").focus();
        return"";
    }
    if(projname === ""){
        alert("Project Name missing");
        $("#projname").focus();
        return"";
    }
    if(projto === ""){
        alert("Assigned to is missing");
        $("#projto").focus();
        return"";
    }
    if(projdate === ""){
        alert("Assignment Date missing");
        $("#projdate").focus();
        return"";
    }
    if(projdeadline === ""){
        alert("Project Deadline missing");
        $("#projdeadline").focus();
        return"";
    }
    
    var jsonStrObj = {
        Id: projid,
        name: projname,
        assignedto:projto,
        assignmentdate:projdate,
        deadline:projdeadline
    };
    return JSON.stringify(jsonStrObj);    
}

function getProj(){
    var projIdJsonObj = getProjIdAsJasonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDBName, projRelationName, projIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.staus === 400){
        $("#Save").prop("disabled", false);
        $("#reset").prop("disabled",false);
        $("#projname").focus();
        
    }else if (resJsonObj.status === 200){
        
        $("#projid").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ""){
        return"";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, projDBName, projRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $("#projid").focus();
}

function changeData(){
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projDBName,  projRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#projid").focus();
}