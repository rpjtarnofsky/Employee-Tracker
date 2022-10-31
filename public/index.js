const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "omer171015415",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // runs the app
    runApp();
});

function runApp() {

    // Prompts the starting questions
    inquirer.prompt({
        name: 'startQuestions',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Search an Employee', 'Search Employee by Department', 'Search Employee by Role', 'Add Employee', 'Remove Employee', 'Add Department', 'Add Role', 'Quit']
    }).then(function (answer) {


        switch (answer.startQuestions) {
            case "View All Employees":
                showAllEmployees();
                break;

            case "Search an Employee":
                searchEmployee();
                break;

            case "Search Employee by Department":
                searchEmployee_Department();
                break;

            case "Search Employee by Role":
                searchEmployee_Role();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;
            case "Quit":
                connection.end();
                break;
        }
    });
}


function showAllEmployees() {

    var allEmployeeArray = [];

    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, function(err, result) {
        if (err) throw err;

        var employeeArray = [];


        for(var i = 0; i < result.length; i++) {

            employeeArray = [];



            employeeArray.push(result[i].id);
            employeeArray.push(result[i].first_name);
            employeeArray.push(result[i].last_name);
            employeeArray.push(result[i].title);
            employeeArray.push(result[i].salary);
            employeeArray.push(result[i].department_name);

            // console.log(employeeArray);


            allEmployeeArray.push(employeeArray);

        }

        // console.log(allEmployeeArray);

        console.log("\n\n\n");
        console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], allEmployeeArray);
        console.log("\n\n\n");

        promptQuit();


    });

}

function searchEmployee() {

    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is your employee's First Name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is your employee's Last Name?"
        }
    ]).then(function(answer) {

        var fullEmployeeArray = [];
        var searchEmployeeArray = [];

        connection.query(query, function(err, result) {
            if (err) throw err;

            // search database for specific searched employee
            for(var i = 0; i < result.length; i++) {
                if (result[i].first_name === answer.firstName && result[i].last_name === answer.lastName) {
                    searchEmployeeArray.push(result[i].id)
                    searchEmployeeArray.push(result[i].first_name)
                    searchEmployeeArray.push(result[i].last_name)
                    searchEmployeeArray.push(result[i].title)
                    searchEmployeeArray.push(result[i].salary)
                    searchEmployeeArray.push(result[i].department_name);

                    fullEmployeeArray.push(searchEmployeeArray);

                }
            }

            

            console.log("\n\n\n");
            console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], fullEmployeeArray);
            console.log("\n\n\n");


            promptQuit();
        });
    });

}




function searchEmployee_Department() {
    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query("SELECT * FROM department", function(err, result) {
        if (err) throw err;


        inquirer.prompt([
            {
                name: "departmentName",
                type: "list",
                message: "What is the department you would like to view?",
                choices: function() {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; i++) {
                        arrChoices.push(result[i].department_name);
                    }

                    return arrChoices;
                }
            }
        ]).then(function(answer) {

            var fullDepartmentArray = [];
            var searchDepartmentArray = [];

            connection.query(query, function(err, result) {
                if (err) throw err;


                // matches employee's by specific department
                for(var i = 0; i < result.length; i++) {
                    if (result[i].department_name === answer.departmentName) {
                        searchDepartmentArray.push(result[i].id)
                        searchDepartmentArray.push(result[i].first_name)
                        searchDepartmentArray.push(result[i].last_name)
                        searchDepartmentArray.push(result[i].title)
                        searchDepartmentArray.push(result[i].salary)
                        searchDepartmentArray.push(result[i].department_name);

                        fullDepartmentArray.push(searchDepartmentArray);

                    }
                }

                

                console.log("\n\n\n");
                console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], fullDepartmentArray);
                console.log("\n\n\n");


                promptQuit();
            });
        });
    });

}

// searches employee by role
function searchEmployee_Role() {


    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query("SELECT * FROM employee_role", function(err, result) {
        if (err) throw err;

        console.log(result);


        inquirer.prompt([
            {
                name: "roleName",
                type: "rawlist",
                message: "What is the role you would like to view?",
                choices: function() {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; i++) {
                        arrChoices.push(result[i].title);
                    }

                    return arrChoices;
                }
            }
        ]).then(function(answer) {

            var fullRoleArray = [];
            var searchRoleArray = [];

            connection.query(query, function(err, result) {
                if (err) throw err;


                // matches employee's by specific department
                for(var i = 0; i < result.length; i++) {
                    if (result[i].title === answer.roleName) {
                        searchRoleArray.push(result[i].id)
                        searchRoleArray.push(result[i].first_name)
                        searchRoleArray.push(result[i].last_name)
                        searchRoleArray.push(result[i].title)
                        searchRoleArray.push(result[i].salary)
                        searchRoleArray.push(result[i].department_name);

                        fullRoleArray.push(searchRoleArray);

                    }
                }

                

                console.log("\n\n\n");
                console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], fullRoleArray);
                console.log("\n\n\n");


                promptQuit();
            });
        });
    });



}


// adds employee to database
function addEmployee() {

    connection.query("SELECT * FROM employee_role", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter the employee's First Name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the employee's Last Name:"
            },
            {
                name: "roleChoice",
                type: "rawlist",
                message: "Enter the employee's role",
                choices: function () {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; i++) {
                        arrChoices.push(result[i].title);
                    }

                    return arrChoices;
                }
            }
        ]).then(function (answer) {

            connection.query("SELECT * FROM employee_role WHERE ?", { title: answer.roleChoice }, function (err, result) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: result[0].id
                });

                console.log("\n Employee added to database... \n");
            })

            promptQuit();
        });
    })
}

// removes employee from database
function removeEmployee() {

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is your Employee's First Name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is your Employee's Last Name?"
        }
    ]).then(function (answer) {

        connection.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [answer.firstName, answer.lastName], function (err) {
            if (err) throw err;

            console.log(`\n ${answer.firstName} ${answer.lastName} has been deleted from the database... \n`)
            promptQuit();
        })


    });

}


// adds department
function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "addDepartment",
        message: "What is the name of your department?"

    }).then(function (answer) {

        connection.query('INSERT INTO department SET ?', { department_name: answer.addDepartment }, function (err) {
            if (err) throw err;
        });

        console.log("\n Department added to database... \n");

        promptQuit();
    });
}


// adds role
function addRole() {

    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Enter the title for this role"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Enter the salary for this role"
            },
            {
                name: "departmentChoice",
                type: "rawlist",
                message: "Choose a department associated with this role",
                choices: function () {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; i++) {
                        arrChoices.push(result[i].department_name);
                    }

                    return arrChoices;
                }
            }
        ]).then(function (answer) {

            connection.query("SELECT * FROM department WHERE ?", { department_name: answer.departmentChoice }, function (err, result) {
                if (err) throw err;
                console.log(result[0].id);

                connection.query("INSERT INTO employee_role SET ?", {
                    title: answer.roleTitle,
                    salary: parseInt(answer.roleSalary),
                    department_id: parseInt(result[0].id)
                });

                console.log("\n Role has been added to database... \n");
            })

            promptQuit();
        });

    })

}


// asks user if they want to quit or keep using the application
function promptQuit() {
    inquirer.prompt({
        type: "list",
        name: "promptQuit",
        message: "Would you like to quit this application or run again?",
        choices: ["Run Again", "Quit"]
    }).then(function (answer) {

        if (answer.promptQuit === "Run Again") {
            runApp();
        } else {
            connection.end();
        }


    });
}