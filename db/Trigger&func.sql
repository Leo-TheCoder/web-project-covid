--Set PatientStatus
CREATE OR REPLACE PROCEDURE UpdatePatientStatus
(c_PatientID INT, c_Status INT)
LANGUAGE SQL
AS 
$$
	DECLARE 
	UPDATE "patient"
	SET Status = c_Status
	WHERE PatientID = c_PatientID
	
-- 	SELECT *
-- 	FROM DIRECT_CONTACT

$$

--View Get Quarantine Area
CREATE OR REPLACE VIEW Get_Quarantine_Area 
AS
	SELECT QA.areaid, QA.areaname, QA.capacity, QA.occupated, 
		WA.wardname  || ', ' || DI.districtname || ', ' || CO.countryname AS areaAddress
	FROM quarantinearea QA, country CO, district DI, ward WA 
	WHERE QA.countryid = CO.countryid AND QA.districtid = DI.districtid AND QA.wardid = WA.wardid AND QA.deleted = 0
	ORDER BY QA.areaid asc

-- Insert pack detail

CREATE OR REPLACE PROCEDURE Insert_pack_detail
(p_ProductPackID packdetail.productpackid%type, p_ProductID packdetail.productid%type, 
 p_Quantity packdetail.quantity%type, p_deleted packdetail.deleted%type)
LANGUAGE SQL
AS
$$
	UPDATE PACKDETAIL
	SET quantity = p_Quantity, deleted = p_deleted
	WHERE productpackid = p_ProductPackID AND productid = p_ProductID;
				  		
	INSERT INTO PACKDETAIL
	(productpackid, productid, quantity, deleted)
	SELECT p_ProductPackID, p_ProductID, p_Quantity, p_deleted
	WHERE NOT EXISTS 
	(
		SELECT * 
		FROM packdetail
		WHERE productpackid= p_ProductPackID AND
			  productid = p_ProductID AND
			  quantity = p_Quantity AND
			  deleted =  p_deleted
	)
$$

--Update occupated number of quarantine area
CREATE OR REPLACE FUNCTION Update_occupated()
RETURNS TRIGGER
AS $$
BEGIN
	IF(TG_ARGV[0]::INTEGER = 0) THEN
		BEGIN
			UPDATE quarantinearea
			SET occupated = occupated + TG_ARGV[1]::INTEGER
			WHERE areaid = NEW.quarantineareaid;
		END;
	ELSE
		BEGIN
			UPDATE quarantinearea
			SET occupated = occupated - 1
			WHERE areaid = OLD.quarantineareaid;
			
			UPDATE quarantinearea
			SET occupated = occupated + 1
			WHERE areaid = NEW.quarantineareaid; 
		END;
	END IF;
	
	RETURN NEW;
END	
$$ LANGUAGE PLPGSQL;

--Trigger insert patient
CREATE TRIGGER INSERT_PATIENT 
AFTER INSERT ON patient
FOR EACH ROW
EXECUTE PROCEDURE Update_occupated('0', '1')

--Trigger delete patient
CREATE TRIGGER DELETE_PATIENT 
BEFORE UPDATE OF status ON patient
FOR EACH ROW
WHEN (NEW.status = -1)
EXECUTE PROCEDURE Update_occupated('0', '-1')

--Trigger change quarantine area
CREATE TRIGGER CHANGE_AREA
AFTER UPDATE OF quarantineareaid on patient
FOR EACH ROW
EXECUTE PROCEDURE Update_occupated('1')


--UPDATE RECURSIVE STATUS OF PATIENT
CREATE OR REPLACE FUNCTION Update_status()
RETURNS TRIGGER
AS $$
BEGIN
	IF (NEW.status != 2) THEN
		BEGIN
			UPDATE patient
			SET status = NEW.status + 1
			WHERE patientid IN
			(
				SELECT dc.contact_patient
				FROM patient pa INNER JOIN direct_contact dc ON pa.patientid = dc.contact_patient
				WHERE dc.source_patient = NEW.patientid AND
		  			  DATE_PART('day', NOW()::timestamp - dc.contact_time::timestamp) <= 14 AND
					  pa.status > NEW.status	
			);
		END;
		
	END IF;	
	RETURN NEW;
END	
$$ LANGUAGE PLPGSQL;

--Trigger update status
CREATE TRIGGER Update_status
AFTER UPDATE OF status ON patient
FOR EACH ROW
WHEN (NEW.status != -1)
EXECUTE PROCEDURE Update_status()










