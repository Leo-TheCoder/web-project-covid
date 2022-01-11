--Set PatientStatus
CREATE OR REPLACE PROCEDURE UpdatePatientStatus
(c_PatientID INT, c_Status INT)
LANGUAGE SQL
AS 
$$
	UPDATE "patient"
	SET Status = c_Status
	WHERE PatientID = c_PatientID
$$

CREATE OR REPLACE VIEW Get_Quarantine_Area 
AS
	SELECT QA.areaid, QA.areaname, QA.capacity, QA.occupated, 
		WA.wardname  || ', ' || DI.districtname || ', ' || CO.countryname AS areaAddress
	FROM quarantinearea QA, country CO, district DI, ward WA 
	WHERE QA.countryid = CO.countryid AND QA.districtid = DI.districtid AND QA.wardid = WA.wardid
	ORDER BY QA.areaid asc
