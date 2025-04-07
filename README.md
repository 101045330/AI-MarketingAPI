# API Access to third party marketers involves following domains out of a another system:
<pre>
+------------------+
| Countries        |
+------------------+
| id (PK)          |
| name             |
| code (UNIQUE)    |
| is_active        |
| ...              |
+------------------+
        | 1:N
        |
+------------------+
| Cities           |
+------------------+
| id (PK)          |
| name             |
| country_id (FK)  |
| is_active        |
| ...              |
+------------------+
        | 1:N
        |
+------------------+
| Institutions     |
+------------------+
| id (PK)          |
| name             |
| city_id (FK)     |
| is_active        |
| ...              |
+------------------+
        | 1:N
        |
+------------------+
| Faculties        |
+------------------+
| id (PK)          |
| institution_id (FK)|
| name             |
| is_active        |
| ...              |
+------------------+
        | 1:N
        |
+------------------+
| Programs         |
+------------------+
| id (PK)          |
| faculty_id (FK)  |
| name             |
| is_active        |
| ...              |
+------------------+
        | 1:N
        |
+------------------+
| ProgramReviews   |
+------------------+
| id (PK)          |
| program_id (FK)  |
| participant_id (FK)|
| rating           |
| comment          |
| ...              |
+------------------+
        | N:1     N:1
        |
+------------------+
| Participants     |
+------------------+
| id (PK)          |
| full_name        |
| email (UNIQUE)   |
| country_id (FK)  |
| city_id (FK)     |
| is_active        |
| ...              |
+------------------+
</pre>


# Section where webusers (third party marketers) gather and feast the data drill

<pre>      
+--------------------------+
| WebUsers                 |
+--------------------------+
| id (PK, INT)             |
|--------------------------|
| //  Core Information     // |
|--------------------------|
| full_name (VARCHAR)      |
| email (VARCHAR, UNIQUE)  |
| password (VARCHAR)       | //  Hashed!
|--------------------------|
| //  Registration &       // |
| //  Activation           // |
|--------------------------|
| registration_date (DATE) |
| activation_token (VARCHAR) | //  For email verification
| activation_expiry (DATETIME) |
| is_active (TINYINT)      | //  0: Not active, 1: Active
|--------------------------|
| //  Access Control       // |
|--------------------------|
| access_code (VARCHAR)    | //  30-day access code
| access_code_expiry (DATETIME) |
| daily_search_limit (INT) | //  e.g., 1000
| daily_search_count (INT) | //  Current day's count
| last_search_date (DATE)  | //  Last day searches were made
|--------------------------|
| //  Queue Management     // |
|--------------------------|
| registration_queue_date (DATE) | //  Date user joined queue
|--------------------------|
| //  Timestamps           // |
|--------------------------|
| created_at (DATETIME)    |
| updated_at (DATETIME)    |
|--------------------------|
| //  Other User Data      // |
| //  (Optional)           // |
|--------------------------|
| ... (Other columns from   |
|     previous User ERD)   |
+--------------------------+

      
</pre>



# Application as a whole 
<pre>
+--------------+        +-------------+        +-------------+
| Countries    |        | Cities      |        | Institutions|
|--------------|        |-------------|        |-------------|
| id (PK)      |        | id (PK)     |        | id (PK)     |
| name         |        | name        |        | name        |
| code         |        | country_id (FK)|        | city_id (FK)|
| is_active    |        | is_active   |        | is_active   |
| ...          |        | ...         |        | ...         |
+--------------+        +-------------+        +-------------+
      | 1:N              | N:1           |        | 1:N
      |                  |               |        |
+-----+--------------+   +-------------+--------+
      |
+--------------+        +-------------+        +--------------+
| Faculties    |        | Programs    |        | ProgramReviews|
|--------------|        |-------------|        |--------------|
| id (PK)      |        | id (PK)     |        | id (PK)      |
| institution_id (FK)|        | faculty_id (FK)|        | program_id (FK)|
| name         |        | name        |        | participant_id (FK) |
| is_active    |        | is_active   |        | rating       |
| ...          |        | ...         |        | comment      |
+--------------+        +-------------+        | ...          |
      | 1:N              | 1:N           |        +--------------+
      |                  |               |        | N:1    N:1
+-----+--------------+   +-------------+--------+
      |                                        |
+--------------+        +--------------+        +--------------+
| Courses      |        | BatchCourses |        | Batches      |
|--------------|        |--------------|        |--------------|
| id (PK)      |        | id (PK)      |        | id (PK)      |
| name         |        | batch_id (FK)  |        | program_id (FK)|
| is_active    |        | course_id (FK) |        | name         |
| ...          |        | ...          |        | is_active    |
+--------------+        +--------------+        | ...          |
      | 1:N              +--------------+        +--------------+
      |                  | N:1   N:1    |        | 1:N
+-----+--------------+   +--------------+--------+
      |
+--------------+        +--------------+        +--------------+
| Participants |        | Instructors  |        | Assignments  |
| (from Students)|        |--------------|        |--------------|
|--------------|        | id (PK)      |        | id (PK)      |
| id (PK)      |        | batch_course_id (FK)|        | batch_courses_id (FK)|
| batch_id (FK)  |        | name         |        | name         |
| name         |        | is_active    |        | is_active    |
| is_active    |        | ...          |        | ...          |
| ...          |        +--------------+        +--------------+
+--------------+        | N:1          |        | 1:N
      | N:1              |              |        |
+-----+--------------+   +--------------+--------+
      |
+--------------+        +------------------+        +--------------+
| Submissions  |        | AssignmentInstructors|        | Attachments  |
|--------------|        |------------------|        |--------------|
| id (PK)      |        | id (PK)          |        | id (PK)      |
| assignment_id (FK)|        | assignment_id (FK)  |        | submission_id (FK)|
| participant_id (FK) |        | instructor_id (FK)  |        | ...          |
| ...          |        | ...              |        +--------------+
+--------------+        +------------------+
      | 1:N              | N:1    N:1       |
      |                  |                  |
+-----+--------------+   +------------------+
      |
+------------+
| MetaData   |
|------------|
| id (PK)    |
| which_table|
| what_record|
| key        |
| value      |
| ...        |
+------------+
</pre>

# Database Schema

<pre>

        class Countries {
    id : INT (PK)
    name : VARCHAR
    code : VARCHAR (UNIQUE)
    is_active : TINYINT
    continent : VARCHAR
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Cities {
    id : INT (PK)
    name : VARCHAR
    country_id : INT (FK)
    latitude : DECIMAL
    longitude : DECIMAL
    is_active : TINYINT
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Institutions {
    id : INT (PK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    city_id : INT (FK)
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Faculties {
    id : INT (PK)
    institution_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Programs {
    id : INT (PK)
    faculty_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    cost : DECIMAL
    intake_season : VARCHAR
    requirements : TEXT
}

class ProgramReviews {
    id : INT (PK)
    program_id : INT (FK)
    participant_id : INT (FK)
    rating : INT
    comment : TEXT
    review_date : DATETIME
}

class Users {
    id : INT (PK)
    full_name : VARCHAR
    email : VARCHAR (UNIQUE)
    country_id : INT (FK)
    city_id : INT (FK)
    is_active : TINYINT
    created_at : DATETIME
    updated_at : DATETIME
}

class Courses {
    id : INT (PK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Batches {
    id : INT (PK)
    program_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    start_date : DATE
    end_date : DATE
}

class BatchCourses {
    id : INT (PK)
    course_id : INT (FK)
    batch_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_jt_any : VARCHAR
    timestamp : DATETIME
}

class Participants {
    id : INT (PK)
    batch_id : INT (FK)
    mode : VARCHAR
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    email : VARCHAR
    phone : VARCHAR
    demography : TEXT
    biography : TEXT
    insurance : TEXT
    disability : TEXT
    extra : TEXT
}

class Instructors {
    id : INT (PK)
    batch_course_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    email : VARCHAR
    phone : VARCHAR
}

class Assignments {
    id : INT (PK)
    batch_courses_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
}

class Submissions {
    id : INT (PK)
    assignment_id : INT (FK)
    participant_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    submission_date : DATETIME
}

class AssignmentInstructors {
    id : INT (PK)
    assignment_id : INT (FK)
    instructor_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    email : VARCHAR
    phone : VARCHAR
}

class Attachments {
    id : INT (PK)
    submission_id : INT (FK)
    name : VARCHAR
    is_active : TINYINT
    code : VARCHAR
    details : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    file : BLOB
}

class MetaData {
    id : INT (PK)
    which_table : VARCHAR
    what_record : INT
    key : VARCHAR
    value : TEXT
    is_active : TINYINT
    code : VARCHAR
    GetAlls : TEXT
    alias_if_any : VARCHAR
    timestamp : DATETIME
    deleted_date : DATETIME
    deleted_by : VARCHAR
    deleted_note : TEXT
}

' Relationships
Countries "1" -- "*" Cities : has
Cities "*" -- "1" Countries : belongs to
Countries "1" -- "*" Users : has
Cities "1" -- "*" Users : has
Cities "1" -- "*" Institutions : has
Institutions "*" -- "1" Cities : belongs to
Institutions "1" -- "*" Faculties : has
Faculties "*" -- "1" Institutions : belongs to
Faculties "1" -- "*" Programs : has
Programs "*" -- "1" Faculties : belongs to
Programs "1" -- "*" Batches : has
Programs "1" -- "*" ProgramReviews : has
ProgramReviews "*" -- "1" Programs : belongs to
ProgramReviews "*" -- "1" Participants : authored by
Batches "*" -- "1" Programs : belongs to
Batches "1" -- "*" BatchCourses : has
Batches "1" -- "*" Participants : has
Courses "1" -- "*" BatchCourses : has
BatchCourses "*" -- "1" Batches : belongs to
BatchCourses "*" -- "1" Courses : belongs to
BatchCourses "1" -- "*" Instructors : has
BatchCourses "1" -- "*" Assignments : has
Participants "*" -- "1" Batches : belongs to
Participants "1" -- "*" Submissions : has
Instructors "*" -- "1" BatchCourses : belongs to
Instructors "1" -- "*" AssignmentInstructors : has
Assignments "*" -- "1" BatchCourses : belongs to
Assignments "1" -- "*" Submissions : has
Assignments "1" -- "*" AssignmentInstructors : has
Submissions "*" -- "1" Assignments : belongs to
Submissions "1" -- "*" Attachments : has
AssignmentInstructors "*" -- "1" Assignments : belongs to
AssignmentInstructors "*" -- "1" Instructors : belongs to
Attachments "*" -- "1" Submissions : belongs to
MetaData "0..1" -- "*" Countries : relates to
MetaData "0..1" -- "*" Cities : relates to
MetaData "0..1" -- "*" Institutions : relates to
MetaData "0..1" -- "*" Faculties : relates to
MetaData "0..1" -- "*" Programs : relates to
MetaData "0..1" -- "*" Courses : relates to
MetaData "0..1" -- "*" Batches : relates to
MetaData "0..1" -- "*" BatchCourses : relates to
MetaData "0..1" -- "*" Participants : relates to
MetaData "0..1" -- "*" Instructors : relates to
MetaData "0..1" -- "*" Assignments : relates to
MetaData "0..1" -- "*" Submissions : relates to
MetaData "0..1" -- "*" AssignmentInstructors : relates to
MetaData "0..1" -- "*" Attachments : relates to

@enduml
</pre>

# Stored Procedures

<pre>
        --  1. Register User
CREATE PROCEDURE sp_register_web_user (
    IN p_full_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),  --  Remember to hash this!
    OUT p_user_id INT,
    OUT p_error_message VARCHAR(255)
)
BEGIN
    DECLARE today DATE;
    DECLARE user_count INT;

    SET today = CURDATE();

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_user_id = NULL;
        SET p_error_message = 'An error occurred during registration.';
        ROLLBACK;
    END;

    START TRANSACTION;

    --  Check daily registration limit
    SELECT COUNT(*) INTO user_count FROM WebUsers WHERE DATE(created_at) = today;
    IF user_count >= 100 THEN
        --  Add to queue
        INSERT INTO WebUsers (full_name, email, password, registration_date, registration_queue_date, is_active)
        VALUES (p_full_name, p_email, p_password, today, today, 0);
        SET p_user_id = LAST_INSERT_ID();
        SET p_error_message = 'Daily registration limit reached. You are in the queue.';
    ELSE
        --  Register user immediately
        INSERT INTO WebUsers (full_name, email, password, registration_date, activation_token, activation_expiry, is_active)
        VALUES (p_full_name, p_email, p_password, today, UUID(), DATE_ADD(NOW(), INTERVAL 24 HOUR), 0);
        SET p_user_id = LAST_INSERT_ID();
        SET p_error_message = NULL;
    END IF;

    COMMIT;
END;

--  2. Activate User
CREATE PROCEDURE sp_activate_web_user (
    IN p_activation_token VARCHAR(255),
    OUT p_user_id INT,
    OUT p_error_message VARCHAR(255)
)
BEGIN
    DECLARE now DATETIME;
    DECLARE new_access_code VARCHAR(255);

    SET now = NOW();

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_user_id = NULL;
        SET p_error_message = 'An error occurred during activation.';
        ROLLBACK;
    END;

    START TRANSACTION;

    SELECT id INTO p_user_id
    FROM WebUsers
    WHERE activation_token = p_activation_token AND activation_expiry > now;

    IF p_user_id IS NOT NULL THEN
        --  Generate access code
        SET new_access_code = UUID();  --  Or your preferred method
        UPDATE WebUsers
        SET is_active = 1,
            access_code = new_access_code,
            access_code_expiry = DATE_ADD(now, INTERVAL 30 DAY),
            activation_token = NULL,  --  Clear the token
            activation_expiry = NULL
        WHERE id = p_user_id;
        SET p_error_message = NULL;
    ELSE
        SET p_user_id = NULL;
        SET p_error_message = 'Invalid or expired activation token.';
    END IF;

    COMMIT;
END;

--  3. Increment Search Count
CREATE PROCEDURE sp_increment_search_count (
    IN p_user_id INT,
    OUT p_allowed BOOLEAN,
    OUT p_error_message VARCHAR(255)
)
BEGIN
    DECLARE today DATE;
    DECLARE user_search_limit INT;
    DECLARE user_search_count INT;
    DECLARE user_last_search_date DATE;

    SET today = CURDATE();
    SET p_allowed = FALSE;
    SET p_error_message = NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_allowed = FALSE;
        SET p_error_message = 'An error occurred while checking search limits.';
        ROLLBACK;
    END;

    START TRANSACTION;

    SELECT daily_search_limit, daily_search_count, last_search_date
    INTO user_search_limit, user_search_count, user_last_search_date
    FROM WebUsers
    WHERE id = p_user_id;

    --  Reset daily count if it's a new day
    IF user_last_search_date IS NULL OR user_last_search_date < today THEN
        UPDATE WebUsers
        SET daily_search_count = 0,
            last_search_date = today
        WHERE id = p_user_id;
        SET user_search_count = 0;  --  Reset local variable
    END IF;

    --  Check if search is allowed
    IF user_search_count < user_search_limit THEN
        UPDATE WebUsers
        SET daily_search_count = daily_search_count + 1,
            last_search_date = today
        WHERE id = p_user_id;
        SET p_allowed = TRUE;
    ELSE
        SET p_allowed = FALSE;
        SET p_error_message = 'Daily search limit exceeded.';
    END IF;

    COMMIT;
END;

--  4.  Daily Queue Processing (Example -  Needs Scheduling)
CREATE PROCEDURE sp_process_registration_queue()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_user_id INT;
    DECLARE cur CURSOR FOR
        SELECT id
        FROM WebUsers
        WHERE registration_queue_date IS NOT NULL
        ORDER BY registration_queue_date
        LIMIT 100;  --  Process up to 100 users

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO current_user_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        --  Generate activation token and set expiry
        UPDATE WebUsers
        SET activation_token = UUID(),
            activation_expiry = DATE_ADD(NOW(), INTERVAL 24 HOUR),
            registration_queue_date = NULL  --  Clear queue flag
        WHERE id = current_user_id;

        --  (Send activation email here -  This is application logic, not SQL)

    END LOOP;

    CLOSE cur;

    COMMIT;
END;

--  5.  Daily Reset (Example -  Needs Scheduling)
CREATE PROCEDURE sp_reset_daily_search_counts()
BEGIN
    UPDATE WebUsers
    SET daily_search_count = 0,
        last_search_date = CURDATE();
END;
</pre>
