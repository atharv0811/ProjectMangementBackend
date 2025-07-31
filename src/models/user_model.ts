import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";

interface UserAttributes {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    mobile: number;
    type?: string | null;
    password?: string;
    role_id?: number
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'password' | 'type'> { }

export interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes { }


const User = sequelize.define<UserInstance>('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mobile: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'internal'
    },
    password: {
        type: DataTypes.STRING
    },
    role_id: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'user',
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: ['password']
        }
    }
})

export default User