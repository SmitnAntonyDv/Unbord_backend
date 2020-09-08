"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      favorite.belongsTo(models.user);
    }
  }
  favorite.init(
    {
      movie_id: DataTypes.INTEGER,
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "favorite",
    }
  );
  return favorite;
};
