DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO department (name) VALUES ('Marketing'), ('Finance'), ('Engineering'), ('Legal');

INSERT INTO role (title, salary, department_id) VALUES 
('Marketing Team Lead', 90000, 1), 
('Marketing Executive', 60000, 1), 
('Finance Manager', 120000, 2),
('Accountant', 100000, 2),
('Hardware Engineer', 130000, 3), 
('Software Engineer', 110000, 3),
('Legal Team Lead', 120000, 4),
('Legal Analyst', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES 
('Nagesh', 'Kalegowda', 1),
('James', 'Khan', 2),
('John', 'Smith', 3),
('John', 'Doe', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Tom', 'Ford', 2, 1),
('Tim', 'Clark', 4, 3);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;