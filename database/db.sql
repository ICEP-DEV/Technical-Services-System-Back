

CREATE TABLE staff(
staff_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
staff_name VARCHAR(45),
staff_surname VARCHAR(45),
email VARCHAR(45),
phone CHAR(10),
office VARCHAR(45),
gender ENUM('male', 'female') NOT NULL,
password VARCHAR(45) NOT NULL,
campus VARCHAR(45)
);

INSERT INTO staff(staff_name,staff_surname,email,phone,gender,campus)
VALUES ('James','Motaung','james34@tut4life.ac','0124578965','male','soshanguve');


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

CREATE TABLE work_request(
 id BIGINT NOT NULL PRIMARY KEY,
 description TEXT,
 req_date date,
 category VARCHAR(45),
 priority VARCHAR(45),
 venue VARCHAR(45),
 image BLOB,
 progress VARCHAR(45),
 feedback VARCHAR(45),
 rating VARCHAR(45),
 admin_id INT,
 tech_id INT,
 FOREIGN KEY (tech_id) REFERENCES technician(id),
 FOREIGN KEY (admin_id) REFERENCES administrator(id)
);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,admin_id,tech_id)
VALUES(1678884550556,'Leaking taps','06-03-2023','Plumbing','High','10-g28','','',1,1);











