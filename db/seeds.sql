
USE employees_db; 


INSERT INTO department (id, name)
VALUES 
(1, "Web Development"), 
(2, "Human Resources"), 
(3, "Customer Services"), 
(4, "Accounting"), 
(5, "Legal");


INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, "Back End", 80000, 1),
(2, "Front End", 80000, 1),
(3, "HR Manager", 75000, 2),
(4, "HR Assistant Manager", 66000, 2),
(5, "Customer Service Manger", 70000, 3),
(6, "Customer Service Assistant Manager", 52000, 3),
(7, "Executive Accountant", 85000, 4),
(8, "Junior Accountant", 67000, 4),
(9, "Executive Lawyer", 90000, 5),
(10, "Paralegal", 75000, 5),



INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Wagner", "Lopes", 1, NULL),       
(2, "Ben", "Fawcett", 2, NULL),
(3, "Marcus", "Malliate", 3, 2),
(4, "Carol", "Shields", 6, 3),
(5, "Alex", "Groat", 5, 3),
(6, "Michael", "West", 7, 4),
(7, "Hadis", "Parsa", 8, 4),
(8, "Ben", "Clewer", 1, 1), 
(9, "Joseph", "Daw", 9, 5), 
(10, "Appoline", "Cogan", 10, 5),
