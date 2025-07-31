import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

interface TeamMembersAttributes {
    id: number;
    team_id: number;
    user_id: number;
}

interface TeamMembersCreationAttributes
    extends Optional<TeamMembersAttributes, "id"> { }

export interface TeamMembersInstance
    extends Model<TeamMembersAttributes, TeamMembersCreationAttributes>,
    TeamMembersAttributes { }

const TeamMembers = sequelize.define<TeamMembersInstance>(
    "team_members",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "team_members",
        timestamps: false,
        underscored: true,
    }
);

export default TeamMembers;
