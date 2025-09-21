import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

interface ProjectAttributes {
    id: number;
    name: string;
    description: string;
    project_owner: number;
    start_date: Date;
    end_date: Date;
    project_team: number;
    priority: "low" | "medium" | "high";
    status: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> { }

export interface ProjectInstance
    extends Model<ProjectAttributes, ProjectCreationAttributes>,
    ProjectAttributes { }

const Project = sequelize.define<ProjectInstance>("project", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    project_team: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        tableName: "projects",
        timestamps: true,
    }
);

export default Project;