exports.AdminAllowedModifiableRoleName = ["student", "librarian", "teacher"];

exports.TeacherAllowedModifiableRole = ["student", "librarian"];

exports.ModifiableRole = {
    ADMIN: 1,
    TEACHER: 2
}

// Object.freeze(ModifiableRole);