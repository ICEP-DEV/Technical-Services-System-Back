CREATE TABLE staff(
staff_id BIGINT NOT NULL PRIMARY KEY,
staff_name VARCHAR(45),
staff_surname VARCHAR(45),
email VARCHAR(45),
phone CHAR(10),
gender ENUM('male', 'female') NOT NULL,
campus VARCHAR(45)
);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus)
VALUES (222424345,'James','Motaung','james34@tut4life.ac.za','0124578965','male','soshanguve');

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus)
VALUES (222466645,'Jane','Moloi','janeMol01@tut4life.ac.za','0124578365','female','soshanguve');

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus)
VALUES (202123345,'Johanna','McAthurthy','mcathurthy4@tut4life.ac.za','0127778360','female','soshanguve');

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus)
VALUES (212879345,'Thabo','Mokoena','mokoanaThab0@tut4life.ac.za','0129354560','male','soshanguve');

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus)
VALUES (202458345,'Dikeledi','Moepi','moepi@tut4life.ac.za','0127878360','female','soshanguve');




CREATE TABLE administrator(
admin_id BIGINT PRIMARY KEY NOT NULL,
admin_name VARCHAR(45),
admin_surname VARCHAR(45),
gender ENUM('male', 'female') NOT NULL,
email VARCHAR(45),
phone CHAR(10), 
password VARCHAR(45));

INSERT INTO administrator(admin_id,admin_name,admin_surname,gender,email,phone,password)
VALUE(202233345,'Mike','Jones','male','mkike234@gmail.com','0124578987','#creQiZ@');

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
VALUES('Software','20-g45');

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
 admin_id BIGINT,
 tech_id BIGINT,
 staff_id BIGINT,
 FOREIGN KEY (tech_id) REFERENCES technician(tech_id),
 FOREIGN KEY (admin_id) REFERENCES administrator(admin_id),
 FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,admin_id,tech_id,staff_id)
VALUES(1678884550556,'Leaking taps','06-03-2023','Plumbing','High','10-g28','','in-progress',202233345,25897486,222424345);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,admin_id,tech_id,staff_id)
VALUES(1678784590556,'Blue screen','06-03-2023','hardware','High','10-112','','complete','the issue is sorted','done with task',4,202233345,25999486,212879345);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,admin_id,tech_id,staff_id)
VALUES(1678684550957,'PC not switching on','06-03-2023','hardware','High','10-102','','complete','sorted','hardware components changed',3,202233345,25999486,222466645);











