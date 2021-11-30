const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNUll: false,
            },
        }, {
            sequelize, 
            timestamps: true, //true이면 createdAt과 updatedAt column 추가
            underscored: false, // 스네이크 케이스(created_at 형식)으로 바꾸는 옵션
            modelName: 'Post', //모델 이름 (노드 프로젝트)
            tableName: 'posts', //테이블 이름 (데이터베이스 테이블 이름)
            paranoid: false, //true이면 deletedAt column 추가, 삭제시 완전히 지워지지 않고 deletedAt에 지운 시각이 기록
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Image, {
            through: 'PostImage'
        });
        db.Post.belongsToMany(db.Hashtag, {
            through: 'PostHashtag'
        });
    }
};