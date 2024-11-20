const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Category = require('../models/Category');
const sequelize = require('sequelize');

// Создание нового голосования
exports.createPoll = async (req, res) => {
  try {
    const { title, category, description, nominees, endDate } = req.body;
    console.log('Получены данные:', { title, category, description, nominees, endDate });

    // Проверяем существование категории
    const existingCategory = await Category.findOne({
      where: { 
        name: category,
        isActive: true 
      }
    });

    if (!existingCategory) {
      return res.status(400).json({ message: 'Указанная категория не существует' });
    }

    // Создаем голосование
    const poll = await Poll.create({
      title,
      categoryId: existingCategory.id,
      description,
      nominees: nominees.map((nominee, index) => ({
        id: index + 1,
        name: nominee.name,
        description: nominee.description || '',
        votes: 0
      })),
      creatorId: req.user.id,
      endDate: new Date(endDate)
    });

    // Получаем созданное голосование
    const pollWithDetails = await Poll.findOne({
      where: { id: poll.id },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: pollWithDetails
    });
  } catch (err) {
    console.error('Подробная ошибка при создании голосования:', err);
    res.status(500).json({ message: 'Ошибка при создании голосования' });
  }
};

// Получение всех активных голосований
exports.getActivePolls = async (req, res) => {
  try {
    const { category } = req.query;
    let whereClause = { isActive: true };
    
    if (category) {
      const categoryObj = await Category.findOne({
        where: { name: category, isActive: true }
      });
      if (categoryObj) {
        whereClause.categoryId = categoryObj.id;
      }
    }

    const polls = await Poll.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: polls.length,
      data: polls
    });
  } catch (err) {
    console.error('Ошибка при получении голосований:', err);
    res.status(500).json({ message: 'Ошибка при получении голосований' });
  }
};

// Получение конкретного голосования
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });

    if (!poll) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }

    res.json({
      success: true,
      data: poll
    });
  } catch (err) {
    console.error('Ошибка при получении голосования:', err);
    res.status(500).json({ message: 'Ошибка при получении голосования' });
  }
};

// Голосование за номинанта
exports.vote = async (req, res) => {
  try {
    const { pollId, nomineeId } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip;
    
    const poll = await Poll.findByPk(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'Голосование завершено' });
    }

    const existingVote = await Vote.findOne({ 
      where: { 
        pollId, 
        ipAddress 
      }
    });

    if (existingVote) {
      return res.status(400).json({ 
        message: 'С этого IP-адреса уже было выполнено голосование' 
      });
    }

    await sequelize.transaction(async (t) => {
      await Vote.create({
        pollId,
        nomineeId,
        userId,
        ipAddress
      }, { transaction: t });

      const nominees = poll.nominees.map(nominee => {
        if (nominee.id === nomineeId) {
          nominee.votes += 1;
        }
        return nominee;
      });

      await poll.update({ nominees }, { transaction: t });
    });

    res.json({
      success: true,
      message: 'Голос успешно учтен'
    });

  } catch (err) {
    console.error('Ошибка при голосовании:', err);
    res.status(500).json({ message: 'Ошибка при голосовании' });
  }
};

exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        }
      ]
    });

    if (!poll) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }

    const totalVotes = poll.nominees.reduce((sum, nominee) => sum + nominee.votes, 0);

    const results = poll.nominees.map(nominee => ({
      id: nominee.id,
      name: nominee.name,
      votes: nominee.votes,
      percentage: totalVotes > 0 ? (nominee.votes / totalVotes * 100).toFixed(2) : 0
    }));

    res.json({
      success: true,
      data: {
        pollId: poll.id,
        title: poll.title,
        totalVotes,
        creator: poll.creator.username,
        results
      }
    });

  } catch (err) {
    console.error('Ошибка при получении результатов:', err);
    res.status(500).json({ message: 'Ошибка при получении результатов голосования' });
  }
}; 