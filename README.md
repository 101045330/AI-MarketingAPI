# erd
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
