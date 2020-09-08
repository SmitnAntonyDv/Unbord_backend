"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
      branch */
    static associate(models) {
      // define association here
      activity.belongsToMany(models.user, {
        through: "useractivity",
        foreignKey: "activityId",
      });
    }
  }
  activity.init(
    {
      activityName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "activity",
    }
  );
  return activity;
};
