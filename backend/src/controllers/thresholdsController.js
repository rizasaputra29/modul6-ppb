import { ThresholdsModel } from "../models/thresholdsModel.js";

export const ThresholdsController = {
  async list(req, res) {
    try {
      const data = await ThresholdsModel.list();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async latest(req, res) {
    try {
      const data = await ThresholdsModel.latest();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const created = await ThresholdsModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteAll(req, res) {
    try {
      await ThresholdsModel.deleteAll();
      res.status(204).send(); // 204 No Content, menandakan sukses tanpa balasan
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
