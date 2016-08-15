// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOkqfBKMBRAOI3fgoFGnv6vxOBwmA5OLo",
    authDomain: "train-schedule-19e0c.firebaseapp.com",
    databaseURL: "https://train-schedule-19e0c.firebaseio.com",
    storageBucket: "train-schedule-19e0c.appspot.com",
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Adds train when button is clicked
$("#submitTrain").on("click", function(){

	// Info user adds
	var train = $("#trainForm").val().trim();
	var destination = $("#destinationForm").val().trim();
	var firstTrain = moment($("#firstTrainForm").val().trim(), "HH:mm").subtract(1, "years").format("hh:mm");
	var frequency = $("#frequencyForm").val().trim();

	// Code for handling the push
	database.ref("push").push({
		name: train,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	});

	// Clears all of the text-boxes
	$("#trainForm").val("");
	$("#destinationForm").val("");
	$("#firstTrainForm").val("");
	$("#frequencyForm").val("");

	// Doesn't refresh the page
	return false;
});

// Firebase watcher and initial loader
database.ref("push").on("child_added", function(childSnapshot, prevChildKey){

	// Log everything that's coming out of snapshot
	console.log(childSnapshot.val());
	console.log(childSnapshot.val().name);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().firstTrain);
	console.log(childSnapshot.val().frequency);

	// Store everything into a variable.
	var nameTrain = childSnapshot.val().name;
	var destinationTrain = childSnapshot.val().destination;
	var frequencyTrain = childSnapshot.val().frequency;
	var trainFirst = childSnapshot.val().firstTrain;

	console.log("trainFirst " + trainFirst);
	console.log("frequency " + frequencyTrain);

	/* 
	To calculate the minutes when the next train will arrive, take the current time in unix subtract 
	the firstTrain time and find the modulus between the difference and the frequency 
	*/
	var diffTime = moment().diff(moment.unix(trainFirst), "minutes");
	var timeMod = diffTime % frequencyTrain;
	var timeMinutes = frequencyTrain - timeMod;

	// To calculate the arrival time, add the timeMinutes to the currrent time
	var timeArrive = moment().add(timeMinutes, "minutes").format("hh:mm A");

	console.log("Diff in time " + diffTime);
	console.log("Time remainder " + timeMod)
	console.log("frequency - remainder: " + timeMinutes);
	console.log("Current time: " + moment().format("hh:mm A"));
	console.log("Time train arrives: " + timeArrive);
	

	// Add each train's data into the table
	$("#addTrain > tbody").append("<tr><td>" + nameTrain + "</td><td>" + destinationTrain + "</td><td>" + frequencyTrain + "</td><td>" + timeArrive + "</td><td>" + timeMinutes + "</td></tr>");

});