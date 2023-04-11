CREATE TABLE department(
dept_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
dept_name VARCHAR(45),
office_number VARCHAR(45)
);

INSERT INTO department(dept_name,office_number)
VALUES ('FINANCE','15-34');

CREATE TABLE staff(
staff_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
staff_name VARCHAR(45),
staff_surname VARCHAR(45),
email VARCHAR(45),
phone CHAR(10),
office VARCHAR(45),
gender ENUM('male', 'female') NOT NULL,
department_id INT,
password VARCHAR(45) NOT NULL,
FOREIGN KEY (department_id) REFERENCES department(dept_id)
);

INSERT INTO staff(staff_name,staff_surname,email,phone,gender,department_id)
VALUES ('James','Motaung','james34@tut4life.ac','0124578965','male',1);


CREATE TABLE administrator(
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
admin_name VARCHAR(45),
admin_surname VARCHAR(45),
gender ENUM('male', 'female') NOT NULL,
email VARCHAR(45),
phone CHAR(10), 
password VARCHAR(45));

INSERT INTO administrator(admin_name,admin_surname,gender,email,phone,password)
VALUE('Mike','Jones','male','mkike234@gmail.com','0124578987','#creQiZ@');

CREATE TABLE work_request(
 id BIGINT NOT NULL PRIMARY KEY,
 description TEXT,
 req_date date,
 category VARCHAR(45),
 priority VARCHAR(45),
 location VARCHAR(45),
 image BLOB,
 progress VARCHAR(45),
 admin_id INT,
 FOREIGN KEY (admin_id) REFERENCES administrator(id)
);

INSERT INTO work_request(id,description,req_date,category,priority,location,image,progress,admin_id)
VALUES(1678884550556,'Leaking taps','06-03-2023','Plumbing','High','10-g28','','',1);

CREATE TABLE division(
 id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
 division_name VARCHAR(45),
 division_location VARCHAR(45)
);

INSERT INTO division(division_name,division_location)
VALUES('Plumbing','18-g07');

CREATE TABLE technician(
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(45),
  surname VARCHAR(45),
  phone CHAR(10),
  gender ENUM('male', 'female'),
  availability ENUM('available', 'busy') NOT NULL,
  division_id INT,
  password VARCHAR(45),
  FOREIGN KEY (division_id) REFERENCES division(id)
);

INSERT INTO technician(name,phone,gender,availability,division_id)
VALUES('John','0124578987','male','available',1);

CREATE TABLE work_order(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	request_id BIGINT,
	description TEXT,
	priority VARCHAR(45),
	venue VARCHAR(45),
	category VARCHAR(45),
	status ENUM('completed', 'In-process') NOT NULL,
	tech_id INT,
	admin_id INT,
	FOREIGN KEY (request_id) REFERENCES work_request(id),
	FOREIGN KEY (tech_id) REFERENCES technician(id),
	FOREIGN KEY (admin_id) REFERENCES administrator(id)
);

INSERT INTO work_order(request_id,description,priority,category,status,tech_id,admin_id)
VALUES(1678884550556,'Leaking taps','high','plumbing','completed',1,1);

CREATE TABLE staff_feedback(
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
feedback TEXT,
tech_rating INT,
request_id BIGINT,
staff_id INT,
FOREIGN KEY (request_id) REFERENCES work_request(id),
FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);


