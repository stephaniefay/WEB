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
  var day = date.getDate();

  var members = [];


  function getVector () {
  	var membersConsult = firebase.database().ref('/');
  	membersConsult.on ('value', function (GCT) {
  		GCT.forEach(function (member) {
        if (members.indexOf(member.key) < 0)
          members.push(member.key);
      });
      putInfo();
    });
  }

  function newCharacter () {
    var content = "<center>Personagem ainda não está na lista (é a primeira vez que ele/a vai marcar um diário)? Adicione-o/a!</center><div class='input-group'><input type='text' id='entry' class='form-control' placeholder='Coloque o nome do personagem'><span class='input-group-btn'><button class='btn btn-info' type='button' onclick='addCharacter()'>Adicionar</button></span></div>";
    document.getElementById("newPersonagem").innerHTML = content;
  }

  function addCharacter () {
    var name = document.getElementById("entry").value;
    if (name.trim() == "")
      return;
    else {
      var update = {
        [name]: {
          valido: true
        }
      }
      firebase.database().ref('/').update(update);
    }
  }

  function putInfo () {
    var content = "<label id='selectList' for='membersList'>Selecione os Personagens  <span class='glyphicon glyphicon-info-sign' data-toggle='tooltip' data-placement='bottom' title='Para selecionar mais de um personagem arraste o mouse sobre aqueles que deseja incluir ou simplesmente vá selecionando os nomes que quer enquanto pressiona ctrl'></span></label><select multiple class='form-control' id='membersList'>";
    for (var i = 0; i < members.length; i++) {
      content += "<option>" + members[i] + "</option>";
    }
    content += "</select><br><center><strong>Esses nomes serão inclusos no dia:</strong><input class='form-control' type='text' value='" + day + "/" + month + "/" + year + "' readonly><br><button type='button' class='btn btn-info' onclick='insertData();'>Salvar!</button></center>";
    document.getElementById("Cadastro").innerHTML = content;

    $('[data-toggle="tooltip"]').tooltip();
    newCharacter();
  }

  function insertData () {
    var select = document.getElementById("membersList");
    var selectedMembers = getSelectValues(select);
    for (var i = 0; i < selectedMembers.length; i++) {
      var update = {
        [day]: true
      };
      firebase.database().ref('/' + selectedMembers[i] + '/' + year + '/' + month).update(update);
    }
  }

  function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
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

  $(document).ready(function() {

  	setTitle();
    getVector();
  });