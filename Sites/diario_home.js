  var config = {
  	apiKey: "AIzaSyCazSpIzEHC21hyLUcBwSXQBfZOFLN5utg",
  	authDomain: "gc-tumblr.firebaseapp.com",
  	databaseURL: "https://gc-tumblr.firebaseio.com",
  	storageBucket: "gc-tumblr.appspot.com",
  	messagingSenderId: "922588699012"
  };
  firebase.initializeApp(config);

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var maxDays;

  var diary = {
  	1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [],
  	16: [], 17: [], 18: [], 19: [], 20: [], 21: [], 22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: [], 29: [], 
  	30: [], 31: []
  }

  var members = {};

  function setTable () {
  	var content = "<table id='contentTable' class='table table-hover table-bordered'>";
  	for (var i = 1; i <= maxDays; i++) {
  		if ((i==1) || (i==11) || (i==21) || (i==31))
  			content += "<tr>";
  		content += "<td><center><strong>" + i + "</strong></center><br><div class='contentDiv'>";
  		for (var k = 0; k < diary[i].length; k++) {
  			content += diary[i][k] + "<br>";
  		}
  		content += "</div></td>";
  		if ((i==10) || (i==20) || (i==30) || (i==maxDays))
  			content += "</tr>";
  	}

  	content += "</table>";
  	document.getElementById("Calendar").innerHTML = content;
  	verifyMonth();
  }

  function exibeDados () {
  	var membersConsult = firebase.database().ref('/');
  	membersConsult.on ('value', function (GCT) {
  		GCT.forEach(function (member) {
  			var count = 0;
  			var name = member.key;
  			var flag = 1;
  			var consult = firebase.database().ref('/' + name + "/" + year + "/" + month + '/');
  			consult.on('value', function (month) {
  				month.forEach (function (days) {
  					if (days.key == flag)
  						flag++;
  					count++;
  					diary[days.key].push(name);
  				});
  			});
  			var d = parseInt(date.getDate());
        if (flag-1 == d) {
	  			var m = {
  				count: count,
  				flag: true
  				}
  				members[name] = m;
  			}
	  		else {
	  			var m = {
  				count: count,
  				flag: false
  				}
  				members[name] = m;
  			}
  		});
		// nesse momento o objeto já está preenchido.
		setTable();
	});
  }


  function leapYear(y) {
  	return ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
  }

  function setTitle () {
  	var content = "";


  	switch (month) {
  		case 1:
  		content += "Janeiro/" + year;
  		maxDays = 31;
  		break;
  		case 2:
  		content += "Fevereiro/" + year;
  		if (leapYear(year))
  			maxDays = 29;
  		else
  			maxDays = 28;
  		break;
  		case 3:
  		content += "Março/" + year;
  		maxDays = 31;
  		break;
  		case 4:
  		content += "Abril/" + year;
  		maxDays = 30;
  		break;
  		case 5:
  		content += "Maio/" + year;
  		maxDays = 31;
  		break;
  		case 6:
  		content += "Junho/" + year;
  		maxDays = 30;
  		break;
  		case 7:
  		content += "Julho/" + year;
  		maxDays = 31;
  		break;
  		case 8:
  		content += "Agosto/" + year;
  		maxDays = 31;
  		break;
  		case 9:
  		content += "Setembro/" + year;
  		maxDays = 30;
  		break;
  		case 10:
  		content += "Outubro/" + year;
  		maxDays = 31;
  		break;
  		case 11:
  		content += "Novembro/" + year;
  		maxDays = 30;
  		break;
  		case 12:
  		content += "Dezembro/" + year;
  		maxDays = 31;
  		break;
  	}

  	document.getElementById("secondTitle").innerHTML = content;

  }

  function verifyMonth () {
  	var title = "A quantidade total será calculada internamente.<li>Membros com a coloração <u>vermelha</u> perderam o mês.</li><li>Membros com a coloração <u>amarela</u> ainda tem chance de completar o mês.</li><li>Membros com a coloração <u>verde</u> completaram o mês!</li>";
  	var content = "<strong>Lista de membros e os dias turnados: <span class='glyphicon glyphicon-info-sign' data-toggle='tooltip' data-html='true' data-placement='bottom' title='" + title + "'></span></strong><br><ul class='list-group'>";
  	for (var name in members) {
    	if (members.hasOwnProperty(name)) {
    		if (members[name].count == maxDays)
    			content += "<li class='list-group-item list-group-item-success'>" + name + "<span class='badge'>" + members[name].count + "</span></li>";
    		else if (members[name].flag == true)
    			content += "<li class='list-group-item list-group-item-warning'>" + name + "<span class='badge'>" + members[name].count + "</span></li>";
    		else
    			content += "<li class='list-group-item list-group-item-danger'>" + name + "<span class='badge'>" + members[name].count + "</span></li>";
    	}
	}
	content += "</ul>";
	document.getElementById("allDays").innerHTML = content;
	$('[data-toggle="tooltip"]').tooltip();
  }

  $(document).ready(function() {
  	setTitle();
  	exibeDados();
  });