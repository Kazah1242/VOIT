const Vote = require('../models/Vote');
const UserVote = require('../models/UserVote');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Создание голосования
const createVote = async (req, res) => {
    try {
        const { title, description, options, endDate } = req.body;
        const vote = await Vote.create({
            title,
            description,
            options: JSON.stringify(options),
            endDate,
            createdBy: req.userId
        });
        res.status(201).json(vote);
    } catch (error) {
        console.error('Ошибка создания голосования:', error);
        res.status(500).json({ message: 'Ошибка при создании голосования' });
    }
};

// Получение активных голосований
const getActiveVotes = async (req, res) => {
    try {
        const votes = await Vote.findAll({
            where: {
                isActive: true,
                endDate: {
                    [Op.gt]: new Date()
                }
            }
        });
        res.json(votes);
    } catch (error) {
        console.error('Ошибка получения голосований:', error);
        res.status(500).json({ message: 'Ошибка при получении голосований' });
    }
};

// Получение голосования по ID
const getVoteById = async (req, res) => {
    try {
        const vote = await Vote.findByPk(req.params.id);
        if (!vote) {
            return res.status(404).json({ message: 'Голосование не найдено' });
        }
        res.json(vote);
    } catch (error) {
        console.error('Ошибка получения голосования:', error);
        res.status(500).json({ message: 'Ошибка при получении голосования' });
    }
};

// Отправка голоса
const submitVote = async (req, res) => {
    try {
        const { voteId, selectedOption } = req.body;
        
        const vote = await Vote.findByPk(voteId);
        if (!vote || !vote.isActive || vote.endDate < new Date()) {
            return res.status(400).json({ message: 'Голосование недоступно' });
        }

        const existingVote = await UserVote.findOne({
            where: {
                userId: req.userId,
                voteId
            }
        });

        if (existingVote) {
            return res.status(400).json({ message: 'Вы уже проголосовали' });
        }

        await UserVote.create({
            userId: req.userId,
            voteId,
            selectedOption
        });

        res.json({ message: 'Ваш голос учтен' });
    } catch (error) {
        console.error('Ошибка при голосовании:', error);
        res.status(500).json({ message: 'Ошибка при голосовании' });
    }
};

// Получение результатов голосования
const getVoteResults = async (req, res) => {
    try {
        const voteId = req.params.id;
        const results = await UserVote.findAll({
            where: { voteId },
            attributes: [
                'selectedOption',
                [sequelize.fn('COUNT', 'selectedOption'), 'count']
            ],
            group: ['selectedOption']
        });
        res.json(results);
    } catch (error) {
        console.error('Ошибка получения результатов:', error);
        res.status(500).json({ message: 'Ошибка при получении результатов' });
    }
};

module.exports = {
    createVote,
    getActiveVotes,
    getVoteById,
    submitVote,
    getVoteResults
}; 