//Requiring mySQL from npm package

var mysql = require("mysql");
var inquirer = require("inquirer");
var yesno = require("yesno");
var sequelize = require("sequelize");

//setting up the connection to mySQL database

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: null,
  database: "bamazon"
});

// var dataProducts = connection.query("Select * FROM products");

// var product = mysql.bamazon.products;

//-----------------------------------------------------------------------------------------//

connection.connect(function(err) {
  if (err) throw err;
  showInventory();
  selectPurchase();
});

function Purchase(id, quantity) {
  this.id = id;
  this.quantity = quantity;
}

function showInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.table(res);
  });
}

function selectPurchase() {
  inquirer
    .prompt([
      {
        name: "id",
        message: "What is the ID of the product you're purchasing?"
      },
      {
        name: "quantity",
        message: "How many would you like to buy?"
      }
    ])
    .then(function(answers) {
      var newPurchase = new Purchase(answers.id, answers.quantity);
      newPurchase.printInfo(answers.id, answers.quantity);
    });

  Purchase.prototype.printInfo = function(id, quantity) {
    console.log(
      "Here is your Order Summary:" +
        "\nProduct ID: " +
        this.id +
        "\nQuantity: " +
        this.quantity
    );

    yesno.ask(
      "Is this correct? Y/N:",
      true,
      function(yes) {
        if (yes) {
          //   console.log("check this.id: ", id);
          function checkQuantity() {
            var query = connection.query(
              "\nSELECT * FROM products WHERE id = ?",
              [id],
              function(err, data) {
                if (err) throw err;
                var dataStock = data[0].stock_quantity;
                if (dataStock <= quantity) {
                  console.log(
                    "Your cart exceeds the item stock! Please select a quantity less than " +
                      dataStock
                  );
                  selectPurchase();
                } else {
                  var newStock = dataStock - quantity;
                  var updateStock = connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE id = ?",
                    [newStock, id]
                  );
                  console.log(
                    "Purchase complete. \nRemaining stock: " + newStock
                  );
                  connection.end();
                }

                // Log all results of the SELECT statement
                // console.table(data);
              }
            );
          }
          checkQuantity();
        } else {
          console.log("Please resubmit your order.");
          selectPurchase();
        }
      },
      ["y"],
      ["n"]
    );
  };
}
