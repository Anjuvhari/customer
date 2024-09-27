import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const customerModel = sequelize.define('customers', {
    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull:false
    }
},
{
    freezeTableName:true,
    timestamps:false
});

export default customerModel;
