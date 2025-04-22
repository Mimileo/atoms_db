enum UserRole {
    SuperAdmin = "superadmin",
    Admin = "admin",
    Instructor = "instructor",
    Student = "student"
}

export default UserRole;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];