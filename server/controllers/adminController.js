const Category = require('../models/Category');
const Nominee = require('../models/Nominee');

// Управление категориями
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Ошибка при создании категории:', err);
    res.status(500).json({ message: 'Ошибка при создании категории' });
  }
};

// Добавление номинанта
exports.addNominee = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      description,
      image,
      additionalInfo
    } = req.body;

    const nominee = await Nominee.create({
      name,
      categoryId,
      description,
      image,
      additionalInfo
    });

    res.status(201).json({
      success: true,
      data: nominee
    });
  } catch (err) {
    console.error('Ошибка при добавлении номинанта:', err);
    res.status(500).json({ message: 'Ошибка при добавлении номинанта' });
  }
};

// Получение всех категорий
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true }
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('Ошибка при получении категорий:', err);
    res.status(500).json({ message: 'Ошибка при получении категорий' });
  }
};

// Получение номинантов по категории
exports.getNomineesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const nominees = await Nominee.findAll({
      where: { categoryId }
    });
    
    res.json({
      success: true,
      data: nominees
    });
  } catch (err) {
    console.error('Ошибка при получении номинантов:', err);
    res.status(500).json({ message: 'Ошибка при получении номинантов' });
  }
}; 