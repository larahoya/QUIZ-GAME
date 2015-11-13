var fs = require('fs');
var prompt = require('prompt');
prompt.start();

function Question(id, text, answer) {
  this.id = id;  
  this.text = text;
  this.answer = answer;
  this.points = 10;
}

function Quiz(questions) {

  var users = [];
  var currentQuestion = 0;
  var totalPoints = 0;
  var questions = questions;
  var bonusQuestion = Math.floor(Math.random()*(questions.length))

  this.quit = function quit() {
    var self = this;
    self.saveUsers();
    console.log('GOOD BYE!');
  }

  this.ask = function ask() {
    var question = questions[currentQuestion];

    if(currentQuestion === bonusQuestion) {
      question.points *= 2;
    }
    
    console.log("\nQuestion number " + currentQuestion);
    var self = this;
    prompt.get(['answer'], function (err, result) {
      if(result.answer === question.answer) {
        currentQuestion++;
        totalPoints += question.points;
        console.log('Correct answer!');
      }else if(result.answer === 'q') {
        return self.quit();
      }else{
        totalPoints -= question.points;
        console.log('Incorrect!!');
      }

      if(currentQuestion < questions.length) {
        ask.bind(self)();
      } else {
        console.log("\nTHE END! You have " + totalPoints + ' points!');
      }

    }); 
  }

  this.play = function play(user) {
    totalPoints = user.points;
    currentQuestion = user.question;

    console.log('Welcome to the game!');
    this.ask();
  }

  this.logn = function logn() {
    var self = this;
    self.checkLogin();
  }


  this.checkUser = function checkUser() {
    var self = this;
    prompt.get(['name'], function (err, result) {
      var correctAnswer = false;
      var correctUser = null;
      users.forEach(function(user) {
        if(result.name === user["name"]) {
          correctUser = user;
          correctAnswer = true;
        }
      })

      if(correctAnswer === true) {
        self.play(correctUser);
      } else {
        console.log('Incorrect user!')
        self.start();
      }
    });
  }

  this.register = function register() {
    var self = this;
    prompt.get(['name'], function (err, result) {
      var newName = result.name;
      var user = new User(newName, 0, 0)
      users.push(user);
      self.saveUsers();
      self.play(user);
    });
  }

  this.start = function start() {
    console.log('Hello! New user? (Y/N)');
    var self = this;
    prompt.get(['newuser'], function (err, result) {
      if(result.newuser === 'Y') {
        self.register();
      }else if(result.newuser === 'N'){
        self.logn();
      }else{
        console.log('Incorrect')
        self.start();
      }
    });
  }

  this.checkLogin = function loadUsers() { 
    var self = this;
    function fileActions(err, file) {
      if (err) {
        throw err;
      };
      var result = JSON.parse(file);
      users = result;
      self.checkUser();
    }
    
    var loaded = fs.readFile("./users.json", fileActions);

  }

  this.saveUsers = function saveUsers() {
    var saved = JSON.stringify(users);
    fs.writeFile("./users.json", saved);
  }

}

function User(name, points, question) {
  this.name = name;
  this.points = points;
  this.question = question;
}

var question1 = new Question(1, 'a', 'a');
var question2 = new Question(2, 'b', 'b');
var question3 = new Question(3, 'c', 'c');
var question4 = new Question(4, 'd', 'd');
var question5 = new Question(5, 'e', 'e');

var myQuestions = [question1, question2, question3, question4, question5];

var users = [];

var myQuiz = new Quiz(myQuestions);
myQuiz.start();