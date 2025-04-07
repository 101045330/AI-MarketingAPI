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
