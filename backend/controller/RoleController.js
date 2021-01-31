const RoleRepository = require("../repository/RoleRepository");
exports.getAdminRoles = (req, res) => {
    RoleRepository.findRoleByRoleTypes(['student','teacher', 'librarian']).then(roles => {
        const mappedRoles = roles.map(role => {
            return {
                id: role.id,
                role: role.role[0].toUpperCase() +
                    role.role.slice(1),
            };
        })
        res.json(mappedRoles);
    });
}

exports.getTeacherRoles = (req, res) => {
    RoleRepository.findRoleByRoleTypes('student').then(roles => {
        const mappedRoles = roles.map(role => {
            return {
                id: role.id,
                role: role.role[0].toUpperCase() +
                    role.role.slice(1),
            };
        })
        res.json(mappedRoles);
    });
}