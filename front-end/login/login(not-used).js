		function xPOSTS(srv,verb,data) {
			return $.ajax({
				url: srv+'/'+verb,
				type: "POST",
				crossDomain: true,
				dataType: "text",
				success: function (response) {
				}
			})
			.fail(function(xhr) {
				alert("error");
			})
		}


var attempt = 3; // Variable to count number of attempts.

// Below function Executes on click of login button.
function validate(){
var username = document.getElementById("username").value; //Taking the username of the field
var password = document.getElementById("password").value; // Taking the password of the field
var loginSrvr="http://localhost:10099"
var session;
  

xPOSTS(loginSrvr,'login/'+sessionID,{
					username:username,
					password:password
				})
    
    
 
    
    
if ( username == "admin" && password == "admin"){ // Comparing it with 'admin'& 'admin'
alert ("Login successfully");
window.location = "../panel"; // Redirecting to page after login
return false;
}
else{
attempt --;// Decrementing by one.
alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
if( attempt == 0){
document.getElementById("username").disabled = true;
document.getElementById("password").disabled = true;
document.getElementById("submit").disabled = true;
return false;
}
}
}