-- Create Enum for Role
CREATE TABLE Role (
    value VARCHAR(255) PRIMARY KEY
);
INSERT INTO Role (value) VALUES ('ADMIN_YAYASAN'), ('ADMIN_UNIT'), ('TEACHER'), ('PARENT');

-- Create Enum for UnitType
CREATE TABLE UnitType (
    value VARCHAR(255) PRIMARY KEY
);
INSERT INTO UnitType (value) VALUES ('RELIGION'), ('GENERAL');


-- Table: Unit
CREATE TABLE `Unit` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`type`) REFERENCES `UnitType`(`value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: User
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL DEFAULT 'PARENT',
    `unitId` VARCHAR(36),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `User_email_key` (`email`),
    FOREIGN KEY (`role`) REFERENCES `Role`(`value`),
    FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Student
CREATE TABLE `Student` (
    `id` VARCHAR(36) NOT NULL,
    `nisn` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unitId` VARCHAR(36) NOT NULL,
    `parentId` VARCHAR(36),
    `status` VARCHAR(255) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Student_nisn_key` (`nisn`),
    FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Class
CREATE TABLE `Class` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unitId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: ClassEnrollment
CREATE TABLE `ClassEnrollment` (
    `id` VARCHAR(36) NOT NULL,
    `studentId` VARCHAR(36) NOT NULL,
    `classId` VARCHAR(36) NOT NULL,
    `academicYear` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `ClassEnrollment_studentId_classId_academicYear_key` (`studentId`, `classId`, `academicYear`),
    FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Attendance
CREATE TABLE `Attendance` (
    `id` VARCHAR(36) NOT NULL,
    `studentId` VARCHAR(36) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `notes` VARCHAR(255),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Attendance_studentId_date_key` (`studentId`, `date`),
    FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Payment
CREATE TABLE `Payment` (
    `id` VARCHAR(36) NOT NULL,
    `studentId` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- RLS Implementation Notes for MySQL:
-- MySQL does not have native Row-Level Security (RLS) policies like some other database systems (e.g., PostgreSQL or SQL Server).
-- This RLS implementation uses SQL VIEWS that filter data based on session variables.
-- The application is responsible for setting these session variables for the current database session:
--   SET @current_user_id = 'the_logged_in_user_id';
--   SET @current_user_role = 'the_logged_in_user_role_enum_value'; (e.g., 'ADMIN_YAYASAN', 'ADMIN_UNIT', 'TEACHER', 'PARENT')
--   SET @current_user_unit_id = 'the_logged_in_user_unit_id'; (optional, if the user is scoped to a unit)
-- These variables must be set correctly by the application before querying any of the RLS views.

-- 1. RLS View for Users
CREATE OR REPLACE VIEW `Users_RLS` AS
SELECT
    u.*
FROM
    `User` u
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all users
    OR (@current_user_role = 'ADMIN_UNIT' AND u.unitId = @current_user_unit_id) -- Admin Unit can see users in their unit
    OR (u.id = @current_user_id); -- Any user can see their own profile

-- 2. RLS View for Units
CREATE OR REPLACE VIEW `Units_RLS` AS
SELECT
    un.*
FROM
    `Unit` un
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all units
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND un.id = @current_user_unit_id); -- Admin Unit/Teacher can see their unit

-- 3. RLS View for Students
CREATE OR REPLACE VIEW `Students_RLS` AS
SELECT
    s.*
FROM
    `Student` s
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all students
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND s.unitId = @current_user_unit_id) -- Admin Unit/Teacher can see students in their unit
    OR (@current_user_role = 'PARENT' AND s.parentId = @current_user_id); -- Parent can see their children

-- 4. RLS View for Classes
CREATE OR REPLACE VIEW `Classes_RLS` AS
SELECT
    c.*
FROM
    `Class` c
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all classes
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND c.unitId = @current_user_unit_id); -- Admin Unit/Teacher can see classes in their unit

-- 5. RLS View for ClassEnrollments
CREATE OR REPLACE VIEW `ClassEnrollments_RLS` AS
SELECT
    ce.*
FROM
    `ClassEnrollment` ce
LEFT JOIN
    `Student` s ON ce.studentId = s.id
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all enrollments
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND s.unitId = @current_user_unit_id) -- Admin Unit/Teacher can see enrollments in their unit
    OR (@current_user_role = 'PARENT' AND s.parentId = @current_user_id); -- Parent can see enrollments for their children

-- 6. RLS View for Attendances
CREATE OR REPLACE VIEW `Attendances_RLS` AS
SELECT
    a.*
FROM
    `Attendance` a
LEFT JOIN
    `Student` s ON a.studentId = s.id
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all attendances
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND s.unitId = @current_user_unit_id) -- Admin Unit/Teacher can see attendances in their unit
    OR (@current_user_role = 'PARENT' AND s.parentId = @current_user_id); -- Parent can see attendances for their children

-- 7. RLS View for Payments
CREATE OR REPLACE VIEW `Payments_RLS` AS
SELECT
    p.*
FROM
    `Payment` p
LEFT JOIN
    `Student` s ON p.studentId = s.id
LEFT JOIN
    `User` current_user ON current_user.id = @current_user_id
WHERE
    @current_user_role = 'ADMIN_YAYASAN' -- Admin Yayasan can see all payments
    OR (@current_user_role IN ('ADMIN_UNIT', 'TEACHER') AND s.unitId = @current_user_unit_id) -- Admin Unit/Teacher can see payments in their unit
    OR (@current_user_role = 'PARENT' AND s.parentId = @current_user_id); -- Parent can see payments for their children