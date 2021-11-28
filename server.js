// Require and Use
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();




// Figlet graphics
var figlet = require('figlet');
console.log("")
console.log("")
figlet('\nMarcs Employee Tracker\n', function(err, data) {
    if (err) {
        console.log('Oh no, Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    console.log('')

    menu()

});


// SQL database connection and Env.
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log('Connected to the employees_db database.')
);




function menu() {
    inquirer.prompt([{
        type: "list",
        message: "Welcome to Marc's employee tracker. Please select from the following options to either view your current work place structure or to make changes... ",
        name: "menu",
        choices: [
            "View All Departments",
            "Add A Department",
            "View All Roles",
            "Add A Role",
            "View All Employees",
            "Add An Employee",
            "Update An Employee Role",
            "Exit"
        ]
    }])


    .then(function(data) {
        if (data.menu === "View All Departments") return viewAllDepartments();
        if (data.menu === "View All Roles") return viewAllRoles();
        if (data.menu === "View All Employees") return viewAllEmployees();
        if (data.menu === "Add A Department") return addADepartment();
        if (data.menu === "Add A Role") return addARole();
        if (data.menu === "Add An Employee") return addAnEmployee();
        if (data.menu === "Update An Employee Role") return update();
        if (data.menu === "Exit Application") return exit()
        console.log("\Application has stopped\n");
    })
};


// Query the database and get function to view all departments. 
async function viewAllDepartments() {
    db.query('SELECT department.name AS "Department Name", department.id AS "Department ID" FROM department', function(err, results) {
        if (err) throw err;
        console.log("Viewing All Department Information")
        console.log("\n")
        console.table(results);
        menu()
    });

};


// Query the database and get function to view all roles. 
function viewAllRoles() {
    db.query('SELECT role.title AS "Role", role.id AS "Role ID" , role.salary AS "Annual Salary", department.name AS Department FROM role JOIN department ON department.id = role.department_id', function(err, results) {
        if (err) throw err;
        console.log("Viewing All Role Information")
        console.log("\n")
        console.table(results);
        menu()
    });
};

// Query the database and get function to view all employees . 
function viewAllEmployees() {
    db.query('SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Role", role.salary AS "Annual Salary", department.name AS "Department Name", concat(manager.first_name, " " , manager.last_name) AS "Manager Name" FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON employee.manager_id = manager.id  ORDER BY employee.id', function(err, results) {
        if (err) throw err;
        console.log("Viewing All Employee Information")
        console.log("\n")
        console.table(results);
        menu()
    });
};

// Query the database and get function to add a new department. 
function addADepartment() {
    console.log("Adding a new department")
    inquirer.prompt([{
        type: "input",
        name: "newDepName",
        message: "What is the name for your new Department?"
    }]).then(answers => {
        db.query('INSERT INTO department(name) VALUES (?)', [answers.newDepName], (err, results) => {
            if (err) throw err;
            console.log("Added a new department!")
            menu()
        })
    })
}

// Query the database and make a function to add a ROLE, must include, NAME, SALARY and DEPARTMENT for the role.  
function addARole() {
    console.log("Adding a new role")
    db.promise().query('SELECT department.id, department.name FROM department')
        .then(([rows]) => {
            let currentDepNames = rows
            let departmentChoices = currentDepNames.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            inquirer.prompt([{
                    type: "input",
                    name: "title",
                    message: "What is the title of this new role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary for this new role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "What department does this role belong too?",
                    choices: departmentChoices
                },
            ]).then(answers => {
                db.query('INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?);', [answers.title, answers.salary, answers.department_id], (err, results) => {
                    if (err) throw err;
                    console.log("New role added to role database.")
                    menu()
                })


            })

        })
}

// Query the database and make a function to add an employee. 
function addAnEmployee() {
    console.log("Adding a new employee")
    db.promise().query('SELECT role.id, role.title FROM role')
        .then(([rows]) => {
            let currentRole = rows
            let roleChoices = currentRole.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            db.promise().query('SELECT employee.id,  concat(employee.first_name," ",employee.last_name) AS Employee FROM employee')
                .then(([rows]) => {
                    let currentEmployee = rows
                    let manager = currentEmployee.map(({ id, Employee }) => ({
                        value: id,
                        name: Employee
                    }));


                    inquirer.prompt([{
                            type: "input",
                            name: "first_name",
                            message: "What is the employees first name?"
                        },
                        {
                            type: "input",
                            name: "last_name",
                            message: "What is the employees last name?"
                        },
                        {
                            type: "list",
                            name: "role_id",
                            message: "What role will this employee be part of?",
                            choices: roleChoices
                        },
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who will be this employees manager?",
                            choices: manager
                        }
                    ]).then(answers => {
                        db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, results) => {
                            // console.log(results)
                            if (err) throw err;
                            console.log("New employee added to employee database.")
                            menu()
                        })
                    })
                })
        })
}

// Query the database and make a function to update an employee.


function update() {
    console.log("Updating employee information")
    db.promise().query('SELECT employee.id, concat(employee.first_name, " ", employee.last_name) AS Employee from employee')
        .then(([rows]) => {
            console.log(" employee updating", rows)
            let whichEmployee = rows
            let selectEmployee = whichEmployee.map(({ id, Employee }) => ({
                value: id,
                name: Employee
            }));

            //select the role.title for update. 
            db.promise().query('SELECT role.id, role.title AS "Role" from role')
                .then(([rows]) => {
                    console.log(" role changing", rows)
                    let whatRole = rows
                    let updatedRole = whatRole.map(({ id, Role }) => ({
                        value: id,
                        name: Role
                    }));

                    inquirer.prompt([{
                            type: "list",
                            name: "employee_pick",
                            message: "Which employee would you like to update?",
                            choices: selectEmployee
                        },
                        {
                            type: "list",
                            name: "new_role",
                            message: "What role will is this employee changing to?",
                            choices: updatedRole
                        }
                    ]).then(answers => {
                        db.query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [answers.new_role, answers.employee_pick], (err, results) => {
                            console.log(results)
                            if (err) throw err;
                            console.log("You have updated this employees details")
                            menu()
                        })
                    })
                })
        })
}



module.exports = menu;