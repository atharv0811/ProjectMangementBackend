import User from "./user_model";
import Role from "./role_model";
import Team from "./team_model";
import TeamMembers from "./team_members_model";
import Project from "./project_model";

// User <=> Role
Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// User <== TeamMembers ==> Team
Team.belongsToMany(User, {
    through: TeamMembers,
    foreignKey: "team_id",
    otherKey: "user_id",
    as: "members",
});

User.belongsToMany(Team, {
    through: TeamMembers,
    foreignKey: "user_id",
    otherKey: "team_id",
    as: "teams",
});

// Team <== Project
Team.hasMany(Project, { foreignKey: "project_team", as: "projects" });
Project.belongsTo(Team, { foreignKey: "project_team", as: "team" });

// User <== Project
User.hasMany(Project, { foreignKey: "project_owner", as: "projects" });
Project.belongsTo(User, { foreignKey: "project_owner", as: "user" });

export { User, Role, Team, Project };