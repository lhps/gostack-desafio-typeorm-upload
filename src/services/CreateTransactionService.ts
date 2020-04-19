import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('');
    }
    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    let category_id = findCategory?.id;

    if (!findCategory) {
      const categoryNew = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(categoryNew);
      category_id = categoryNew.id;
    }
    // console.log('Tamanho da categoria categoria - >', categoryNew);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
