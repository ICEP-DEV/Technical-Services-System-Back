CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  faculty VARCHAR(75),
  department VARCHAR(45),
  venue VARCHAR(45),
  telephone_num CHAR(10),
  email VARCHAR(45)
);

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Computer Science','18-G01');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Informatics','18-G01');

INSERT INTO department(faculty,department,venue)
VALUES ('Economics and Finances','Department of Accounting','2-g02');

INSERT INTO department(faculty,department,venue)
VALUES ('Economics and Finances','Department of Auditing','2-14');

INSERT INTO department(faculty,department,venue)
VALUES ('Economics and Finances','Department of Economics','4-20');

INSERT INTO department(faculty,department,venue)
VALUES ('Economics and Finances','Department of Finance and Investment','8-g05');

INSERT INTO department(faculty,department,venue)
VALUES ('Economics and Finances','Department of Public Sector Finance','2-g02');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Department of Biomedical Sciences','10-12');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Department of Chemistry','10-110');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Department of Physics','18-12');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Department of Biotechnology and food technology','10-12');




CREATE TABLE staff(
staff_id BIGINT NOT NULL PRIMARY KEY,
staff_name VARCHAR(45),
staff_surname VARCHAR(45),
email VARCHAR(45),
phone CHAR(10),
gender ENUM('male', 'female') NOT NULL,
campus VARCHAR(45),
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(department_id)
);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (222424345,'James','Motaung','james34@tut4life.ac.za','0124578965','male','Soshanguve South',1);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (222466645,'Jane','Moloi','janeMol01@tut4life.ac.za','0124578365','female','Soshanguve South',2);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (202123345,'Johanna','McAthurthy','mcathurthy4@tut4life.ac.za','0127778360','female','Soshanguve South',1);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (212879345,'Thabo','Mokoena','mokoanaThab0@tut4life.ac.za','0129354560','male','Arcadia',9);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (202458345,'Dikeledi','Moepi','moepi@tut4life.ac.za','0127878360','female','Ga-rankuwa',5);




  CREATE TABLE administrator(
admin_id BIGINT PRIMARY KEY NOT NULL,
admin_name VARCHAR(45),
admin_surname VARCHAR(45),
gender ENUM('male', 'female') NOT NULL,
email VARCHAR(45),
phone CHAR(10), 
campus VARCHAR(45),
password VARCHAR(45));

INSERT INTO administrator(admin_id,admin_name,admin_surname,gender,email,phone,campus,password)
VALUE(202233345,'Mike','Jones','male','mkike234@gmail.com','0124578987','Soshanguve South','#creQiZ@');

CREATE TABLE division(
 id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
 division_name VARCHAR(45),
 division_location VARCHAR(45)
);

INSERT INTO division(division_name,division_location)
VALUES('Plumbing','18-g07');

INSERT INTO division(division_name,division_location)
VALUES('Hardware','20-g45');

INSERT INTO division(division_name,division_location)
VALUES('Carpentry','20-g45');

INSERT INTO division(division_name,division_location)
VALUES('Network','14-g13');

INSERT INTO division(division_name,division_location)
VALUES('Electrical','5-12');

CREATE TABLE technician(
  tech_id BIGINT NOT NULL PRIMARY KEY,
  name VARCHAR(45),
  surname VARCHAR(45),
  phone CHAR(10),
  email VARCHAR(45),
  gender ENUM('male', 'female'),
  availability ENUM('available', 'busy') NOT NULL,
  division_id INT,
  campus VARCHAR(45),
  password VARCHAR(45),
  FOREIGN KEY (division_id) REFERENCES division(id)
);

INSERT INTO technician(tech_id,name,surname,phone,email,gender,availability,division_id,campus,password)
VALUES(25897486,'John','Black','0124578987','john@tut.ac.za','male','available',1,'soshanguve south','john%Bl@ck');

INSERT INTO technician(tech_id,name,surname,phone,email,gender,availability,division_id,campus,password)
VALUES(25999486,'Sam','Modise','01245745981','sammodise@tut.ac.za','male','available',2,'soshanguve south','s@mModI~3');


CREATE TABLE work_request(
 id BIGINT NOT NULL PRIMARY KEY,
 description TEXT,
 req_date date,
 category VARCHAR(45),
 priority VARCHAR(45),
 venue VARCHAR(45),
 image BLOB,
 progress VARCHAR(45),
 staff_feedback TEXT,
 tech_feedback TEXT,
 rating INT,
 status ENUM ('active','closed'),
 completed_date date,
 assigned_date date,
 admin_id BIGINT,
 tech_id BIGINT,
 staff_id BIGINT,
 FOREIGN KEY (tech_id) REFERENCES technician(tech_id),
 FOREIGN KEY (admin_id) REFERENCES administrator(admin_id),
 FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,status,admin_id,tech_id,staff_id)
VALUES(1678884550556,'Leaking taps','2023-03-20','Plumbing','High','10-g28','','in-progress','active',202233345,25897486,222424345);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,admin_id,tech_id,staff_id)
VALUES(1678784590556,'Blue screen','2023-03-06','Hardware','High','10-112','','complete','the issue is sorted','done with task',4,'closed',202233345,25999486,212879345);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,admin_id,tech_id,staff_id)
VALUES(1678684550957,'PC not switching on','2023-03-15','Hardware','High','10-102','','complete','sorted','hardware components changed',3,'closed',202233345,25999486,222466645);











