const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
                defaultValue: 'local',
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',    //foreignKey 반대되는 모델, Followers를 찾기위해서는 followingId를 찾아야한다.
            through: 'Follow',  //생성할 모델 이름
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
};