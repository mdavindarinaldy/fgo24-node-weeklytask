/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("casts", [
      { id: 1, name: "Leonardo DiCaprio", created_at: now, updated_at: now },
      { id: 2, name: "Emma Stone", created_at: now, updated_at: now },
      { id: 3, name: "Brad Pitt", created_at: now, updated_at: now },
      { id: 4, name: "Tom Holland", created_at: now, updated_at: now },
      { id: 5, name: "Zendaya", created_at: now, updated_at: now },
      { id: 6, name: "Florence Pugh", created_at: now, updated_at: now },
      { id: 7, name: "Cillian Murphy", created_at: now, updated_at: now },
      { id: 8, name: "Timothée Chalamet", created_at: now, updated_at: now },
      { id: 9, name: "Margot Robbie", created_at: now, updated_at: now },
      { id: 10, name: "Robert Downey Jr.", created_at: now, updated_at: now },
      { id: 11, name: "Natalie Portman", created_at: now, updated_at: now },
      { id: 12, name: "Daniel Kaluuya", created_at: now, updated_at: now },
      { id: 13, name: "Saoirse Ronan", created_at: now, updated_at: now },
      { id: 14, name: "Adam Driver", created_at: now, updated_at: now },
      { id: 15, name: "Ryan Gosling", created_at: now, updated_at: now },
      { id: 16, name: "Anya Taylor-Joy", created_at: now, updated_at: now },
      { id: 17, name: "Joaquin Phoenix", created_at: now, updated_at: now },
      { id: 18, name: "Lupita Nyong'o", created_at: now, updated_at: now },
      { id: 19, name: "Keanu Reeves", created_at: now, updated_at: now },
      { id: 20, name: "Millie Bobby Brown", created_at: now, updated_at: now },
      { id: 21, name: "Chris Hemsworth", created_at: now, updated_at: now },
      { id: 22, name: "Tilda Swinton", created_at: now, updated_at: now },
      { id: 23, name: "Dev Patel", created_at: now, updated_at: now },
      { id: 24, name: "Jessica Chastain", created_at: now, updated_at: now },
      { id: 25, name: "Michael B. Jordan", created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("casts", null, {});
  },
};
