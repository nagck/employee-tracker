// Require following libraries
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const logo = require('asciiart-logo');
const chalk = require('chalk');

//Variables
let employeeNames = [];
let employeeRoles = [];

// MySQL connection information 
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "employee_db"
});
// Create and test database connection 
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});

const start = () => {
    console.log(
    logo({
        name: 'Employee Tracker',
        font: 'Standard',
        lineChars: 10,
        padding: 1,
        margin: 1,
        borderColor: 'red',
        logoColor: 'white',
        textColor: 'red',
    })
    .render()
);
    startPrompt();
};
// Function to start Inquirer prompts for user to select required action
const startPrompt = () => {
    // console.log(`
    // --------------------------------------------
    // --------------------------------------------
    
    //     Welcome to Employee Tracker System!!!

    // --------------------------------------------
    // --------------------------------------------
    // `);
    
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all employees by role',
            'View all employees by department',
            'Add department',
            'Add role',
            'Add employee',
            'Update employee role',
        ]
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    viewEmployee();
                break;
    
                case 'View all employees by role':
                    viewRoles();
                break;
    
                case 'View all employees by department':
                    viewDept();
                break;
    
                case 'Add department':
                    addDept();
                break;
    
                case 'Add role':
                    addRole();
                break;

                case 'Add employee':
                    addEmployee();
                break;
                
                case 'Update employee role':
                    updateEmpRole();
                break;

                // default:
                // console.log(`Invalid action: ${answer.action}`);
                // break;
            }
        });
};  

//Function to 'View all employees'
const viewEmployee = () => {
    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary, CONCAT(m.first_name, ' ' , m.last_name) AS Manager 
    FROM employee e
    INNER JOIN role ON e.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
    }
    );
}

//Function to 'View all employee by role'
const viewRoles = () => {
    const query = `SELECT e.first_name, e.last_name, role.title AS Title 
    FROM employee e
    JOIN role ON e.role_id = role.id;`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
        }
    )
}

//Function to 'View all employees by department'
const viewDept = () => {
    const query = `SELECT e.first_name, e.last_name, department.name AS Department 
    FROM employee e
    JOIN role ON e.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    ORDER BY e.id;`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
    }
    )
}

//Function to add Department
const addDept = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Please enter the name of the department to be added',
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO department SET ?', 
        {
            name: answer.name  
        }, 
        (err) => {
            if (err) throw err;
            console.table(answer);
            startPrompt();
        });
    });
}

//Function to add Role
const addRole = () => {
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title of the role to be added?",
            },
            {
                name: 'salary',
                type: 'input',
                message: "What is the salary for the role to be added?"
            },
            {
                name: 'department_id',
                type: 'input',
                message: "What is the department_id for this role?"
            }
        ])
        .then((answer) => {
            connection.query("INSERT INTO role SET ?", 
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            }, 
            (err) => {
                if (err) throw err;
                console.table(answer);
                startPrompt();
            });
        });
    // });
}

// Array to provide role choices for 'add Employee' and 'update Employee' functions
let roleArr = [];
var roleChoices = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }   
    })
    return roleArr;
}

// Array to provide manager choices for 'add Employee'
let managerArr = [];
var managerChoices = () => {
    connection.query(`SELECT first_name, last_name 
    FROM employee 
    WHERE manager_id IS NULL
    `, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name);
        }
    })
    return managerArr;
}

// Function to add Employee
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the Employee's first name?",
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the Employee's last name?",
        },
        {
            name: 'role',
            type: 'rawlist',
            message: "What is the employee's role?",
            choices: roleChoices()
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: "What is the emplpoyee's manager's name?",
            choices: managerChoices()
        }
    ])
    .then((answer) => {
        let roleId = roleChoices().indexOf(answer.role) + 1
        let managerId = managerChoices().indexOf(answer.manager) + 1
        connection.query("INSERT INTO employee SET ?", 
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            manager_id: managerId,
            role_id: roleId       
        }, 
        (err) => {
            if (err) throw err;
            console.table(answer);
            startPrompt();
        }
        );
    });   
}

//Function to update Employee Role'
const updateEmpRole = () => {
  
    connection.query(
        `
        SELECT id, CONCAT(first_name,' ',last_name) AS employee
        FROM employee
        `,
        (err, names) => {
            if (err) throw err;

            for (let i = 0; i < names.length; i++) {
                employeeNames.push(names[i].employee);
            }
            connection.query(
                `
                SELECT id, title  
                FROM role
                `,
                (err, roles) => {
                    if (err) throw err;
                    for (let i = 0; i < roles.length; i++) {
                        employeeRoles.push(roles[i].title);
                    }
                    inquirer
                        .prompt([{
                            name: 'employeeName',
                            type: 'list',
                            message: 'Which employee name would you like to change the role for?',
                            choices: employeeNames
                        }, {
                            name: 'employeeRole',
                            type: 'list',
                            message: 'Please select the new role for your selected employee',
                            choices: employeeRoles
                        }])
                        .then((answer) => {

                            // Set variable for role and employee IDs
                            let roleID;
                            let employeeID;

                            // Get the employee.id
                            for (i = 0; i < names.length; i++) {
                                if (answer.employeeName == names[i].employee) {
                                    employeeID = names[i].id;
                                }
                            }

                            // Get the role.id
                            for (i = 0; i < roles.length; i++) {
                                if (answer.employeeRole == roles[i].title) {
                                    roleID = roles[i].id;
                                }
                            }

                            connection.query(
                                'UPDATE employee SET ? WHERE ?', [{
                                        role_id: roleID,
                                    },
                                    {
                                        id: employeeID,
                                    },
                                ],
                                (err, res) => {
                                    if (err) return err;

                                    console.log(chalk.green(`\n Employee ${answer.employeeName}, role has been updated to the title of: ${answer.employeeRole} \n`));
                                    startPrompt();
                                }
                            )

                        })
                })

        })

};

