import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

interface RoleAttributes {
    id: number;
    title: string;
    active: boolean
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> { }

export interface RoleInstance
    extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes { }

const Role = sequelize.define<RoleInstance>(
    "role",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "role",
        timestamps: true,
        underscored: true,
    }
);

export default Role;
