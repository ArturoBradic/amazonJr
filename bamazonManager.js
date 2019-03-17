var mysql = require("mysql");
var inquirer = require("inquirer");
var yesno = require("yesno");
var sequelize = require("sequelize");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Areyoureadykids?",
    database: "bamazon"
  });