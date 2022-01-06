CREATE TABLE ACCOUNT
( ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
 (START WITH 1 INCREMENT BY 1),
 PASSWORD VARCHAR(150),
 TYPE CHAR, --A: ADMIN - P: PATIENT -M: MANAGER
 STATUS INT,
 phonenumber VARCHAR(10)
)


CREATE TABLE PRODUCT
(
	ProductID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	ProductName VARCHAR(50),
	ProductPrice REAL,
	ProductUnit VARCHAR(50),
	Deleted INT DEFAULT 0
)

CREATE TABLE PRODUCTPACK
(
	ProductPackID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	ProductPackName VARCHAR(50),
	ProductPackLimit INT,
	TimeUnit INT --DAY,
	Deleted INT DEFAULT 0
)

CREATE TABLE PACKDETAIL
(
	ProductPackID INT,
	ProductID INT,
	Quantity INT,
	Deleted INT DEFAULT 0,
	
	CONSTRAINT PK_PACKDETAIL
	PRIMARY KEY (PRODUCTPACKID, PRODUCTID),
	
	CONSTRAINT FK_DETAIL_PRODUCT
	FOREIGN KEY (ProductID)
	REFERENCES PRODUCT,
	
	CONSTRAINT FK_DETAIL_PACK
	FOREIGN KEY(ProductPackID)
	REFERENCES PRODUCTPACK
)

CREATE TABLE COUNTRY 
(
	CountryID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	CountryName VARCHAR(50)
)

CREATE TABLE DISTRICT
(
	CountryID INT,
	DistrictID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
	DistrictName VARCHAR(50),
	
	CONSTRAINT PK_DISTRICT
	PRIMARY KEY (COUNTRYID, DISTRICTID),
	
	CONSTRAINT FK_DISTRICT
	FOREIGN KEY (COUNTRYID)
	REFERENCES COUNTRY
)

CREATE TABLE WARD
(
	CountryID INT,
	DistrictID INT,	
	WardID INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),	
	WardName VARCHAR(50),
	
	CONSTRAINT PK_WARD
	PRIMARY KEY (COUNTRYID, DISTRICTID, WARDID),
	
	CONSTRAINT FK_WARD
	FOREIGN KEY (COUNTRYID, DISTRICTID)
	REFERENCES DISTRICT
)

CREATE TABLE QUARANTINEAREA
(
	AreaID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	AreaName VARCHAR(50),
	Capacity INT,
	Occupated INT, 
	CountryID INT,
	DistrictID INT, 
	WardID INT,
	Deleted INT DEFAULT 0
	
	CONSTRAINT FK_LOCATION
	FOREIGN KEY(COUNTRYID, DISTRICTID, WARDID)
	REFERENCES WARD
)

CREATE TABLE MANAGER 
(
	ManagerID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	ManagerName VARCHAR(50),
	ManagerDOB DATE,
	ManagerADDRESS VARCHAR(50),
	ManagerIDNUMBER VARCHAR(50) UNIQUE,
	ManagerPHONE VARCHAR(10),
	ManagerACCOUNTID INT,
	WorkAreaID INT,
	Current INT DEFAULT 1, ---Manager is still working or not
	
	CONSTRAINT FK_MANAGER_ACCOUNT
	FOREIGN KEY (MANAGERACCOUNTID)
	REFERENCES ACCOUNT,
	
	CONSTRAINT FK_MANAGER_WORK
	FOREIGN KEY (WorkAreaID)
	REFERENCES QUARANTINEAREA
)

CREATE TABLE PATIENT
(
	PatientID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	PatientName VARCHAR(50),
	PatientDOB DATE,
	PatientADDRESS VARCHAR(50),
	PatientIDNUMBER VARCHAR(50) UNIQUE,
	PatientPHONE VARCHAR(10),
	PatientACCOUNTID INT,
	QuarantineAreaID INT,
	Status INT,
	StartDate DATE,
	EndDate DATE, 
	ManagerID INT,
	
	CONSTRAINT FK_PATIENT_ACCOUNT
	FOREIGN KEY (PatientACCOUNTID)
	REFERENCES ACCOUNT,
	
	CONSTRAINT FK_PATIENT_AREA
	FOREIGN KEY (QuarantineAreaID)
	REFERENCES QUARANTINEAREA,
	
	CONSTRAINT FK_PATIENT_MANAGER
	FOREIGN KEY (ManagerID)
	REFERENCES MANAGER	
)

CREATE TABLE SHOPORDER
(
	OrderID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	ManagerID INT, 
	PatientID INT,
	CreatedTime TIMESTAMP,
	AcceptedTime TIMESTAMP,
	Status CHAR,
	Total REAL,
	
	FOREIGN KEY (MANAGERID)
	REFERENCES MANAGER,
	
	FOREIGN KEY (PATIENTID)
	REFERENCES PATIENT
)

CREATE TABLE ORDERDETAIL
(
	DETAILID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	ORDERID INT,
	PACKID INT,
	PRODUCTID INT,
	QUANTITY INT,
	PRODUCTPRICE REAL,
	
	UNIQUE (ORDERID, PACKID, PRODUCTID),
	
	FOREIGN KEY (ORDERID)
	REFERENCES SHOPORDER,
	
	FOREIGN KEY (PACKID, PRODUCTID)
	REFERENCES PACKDETAIL
)

CREATE TABLE PRODUCTPIC
(
	PICID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	PRODUCTID INT,
	LINKPIC VARCHAR(150),
	
	UNIQUE(PRODUCTID, LINKPIC),
	
	FOREIGN KEY(PRODUCTID)
	REFERENCES PRODUCT
)

CREATE TABLE AUDIT
(
	AUDITID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	USERID INT,
	USER_ACTION VARCHAR(150),
	ACTION_METHOD VARCHAR (150),
	ACTION_TIME TIMESTAMP
	
	FOREIGN KEY (USERID)
	REFERENCES ACCOUNT
)

CREATE TABLE CART
(
	CART_ID  INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	PatientID INT,
	Total_Quantity INT, 
	Updated_time TIME, 
	
	FOREIGN KEY (PatientID)
	REFERENCES Patient
)

CREATE TABLE CART_DETAIL
(
	CART_DETAIL_ID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	(START WITH 1 INCREMENT BY 1),
	CART_ID INT,
	PACKID INT,
	PRODUCTID INT,
	QUANTITY INT,
	PRODUCTPRICE REAL,
	
	UNIQUE (CART_ID, PACKID, PRODUCTID),
	
	FOREIGN KEY (CART_ID)
	REFERENCES CART,
	
	FOREIGN KEY (PACKID, PRODUCTID)
	REFERENCES PACKDETAIL
)