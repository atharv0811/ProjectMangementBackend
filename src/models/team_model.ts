import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { UserInstance } from "./user_model";

interface TeamAttributes {
    id: number;
    name: string;
    team_lead: number;
}

interface TeamCreationAttributes
    extends Optional<TeamAttributes, "id"> { }

export interface TeamInstance
    extends Model<TeamAttributes, TeamCreationAttributes>,
    TeamAttributes {
    // Add these mixins for the `members` association
    getMembers: () => Promise<UserInstance[]>;
    setMembers: (members: number[] | UserInstance[]) => Promise<void>;
    addMember: (member: number | UserInstance) => Promise<void>;
    addMembers: (members: number[] | UserInstance[]) => Promise<void>;
    removeMember: (member: number | UserInstance) => Promise<void>;
    hasMember: (member: number | UserInstance) => Promise<boolean>;
}

const Team = sequelize.define<TeamInstance>("team", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    team_lead: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "team",
    timestamps: true,
    underscored: true,
});

export default Team;