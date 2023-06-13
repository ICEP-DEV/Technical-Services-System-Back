CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  faculty VARCHAR(75),
  department VARCHAR(45),
  venue VARCHAR(45),
  telephone_num CHAR(10),
  email VARCHAR(45)
);

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Computer Science','12-12');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Informatics','12-180');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Information Technology','12-G01');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','Department of Computer Systems Engineering','12-11');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','ICT first years and foundation unit','12-5');

INSERT INTO department(faculty,department,venue)
VALUES ('Information Communication Technology','End user computing','12-11');

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

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Department of Animal sciences','10-121');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Adelaide Tambo School of nursing sciences','10-101');

INSERT INTO department(faculty,department,venue)
VALUES ('Science','Mathematics and sciences','10-101');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of architecture and industrial design','21-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of building sciences','21-g6');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of chemical ,metallurgical and materials engineering','21-10');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of civil engineering','20-21');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of electrical engineering','21-5');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of geomatics','21-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Department of industrial engineering','21-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Engineering and the Built Environment','Mechanical and mechatronics engineering','21-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department Applied languages','17-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department Integrated Communication','17-1');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department of law','17-3');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department of Public management','17-3');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department of Safety and security management','17-3');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','Department of Safety and security management','17-3');

INSERT INTO department(faculty,department,venue)
VALUES ('Humanities','School of Education','17-3');



CREATE TABLE hod(
  hod_id INT PRIMARY KEY NOT NULL,
  name VARCHAR(45),
  surname VARCHAR(45),
  email VARCHAR(45),
  campus VARCHAR(45),
  password VARCHAR(45),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(department_id)
);


INSERT INTO hod(hod_id,name,surname,email,campus,password,department_id)
VALUES(225896874,'JC','Janse van Vuuren','tyson@tut.ac.za','Soshanguve South','admin',1);

INSERT INTO hod(hod_id,name,surname,email,campus,password,department_id)
VALUES(215890874,'RC','Mogase','mogase@tut.ac.za','Soshanguve South','admin',2);

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
VALUES (212879345,'Thabo','Mokoena','mokoanaThab0@tut4life.ac.za','0129354560','male','Arcadia',15);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (202458345,'Dikeledi','Moepi','moepi@tut4life.ac.za','0127878360','female','Ga-rankuwa',5);

INSERT INTO staff(staff_id,staff_name,staff_surname,email,phone,gender,campus,department_id)
VALUES (212453459,'Marcia','Smith','marciSmith@tut.ac.za','0127796360','female','Pretoria',5);


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
VALUES(25999486,'Sam','Modise','0124574581','sammodise@tut.ac.za','male','available',2,'soshanguve south','s@mModI~3');

INSERT INTO technician(tech_id,name,surname,phone,email,gender,availability,division_id,campus,password)
VALUES(25997850,'Tebogo','Zwane','0124345666','tebogoZwane@tut.ac.za','male','available',5,'soshanguve south','tebogo');

INSERT INTO technician(tech_id,name,surname,phone,email,gender,availability,division_id,campus,password)
VALUES(25997936,'Xolile','Dube','0128745963','xoliDube@tut.ac.za','male','available',5,'Acardia','1xoli');

INSERT INTO technician(tech_id,name,surname,phone,email,gender,availability,division_id,campus,password)
VALUES(25997859,'Sifiso','Khumalo','0124347852','Skhumalo@tut.ac.za','female','available',2,'soshanguve south','sifis0');




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
VALUES(1678784590556,'Blue screen','2023-03-06','Hardware','High','10-112','','complete','the issue is sorted','done with task',4,'active',202233345,25999486,212879345);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,admin_id,tech_id,staff_id)
VALUES(1678684550957,'PC not switching on','2023-03-15','Hardware','High','10-102','','complete','sorted','hardware components changed',3,'closed',202233345,25999486,222466645);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,completed_date,assigned_date,admin_id,tech_id,staff_id)
VALUES(1678584897459,'No hot water','2023-04-20','Electrical','High','11-62','','complete','sorted','thermostat replaced',3,'closed','2023-04-23','2023-04-23 ',202233345,25997936,222466645);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,completed_date,assigned_date,admin_id,tech_id,staff_id)
VALUES(1678584235896,'Flickering lights','2023-04-10','Electrical','High','4-112','','complete','sorted','lights changed',3,'closed','2023-03-14','2023-04-13 ',202233345,25997936,222466645);

INSERT INTO work_request(id,description,req_date,category,priority,venue,image,progress,staff_feedback,tech_feedback,rating,status,completed_date,assigned_date,admin_id,tech_id,staff_id)
VALUES(1678584330959,'Blocked toilets','2023-03-15','Plumbing','High','10-112','','complete','sorted','pipes changed',3,'closed','2023-03-19','2023-03-19 ',202233345,25897486,222466645);





