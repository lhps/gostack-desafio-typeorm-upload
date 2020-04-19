import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    const income = transactions.reduce((result, transaction) => {
      if (transaction.type === 'income') return result + transaction.value;

      return result;
    }, 0);

    const outcome = transactions.reduce((result, transaction) => {
      if (transaction.type === 'outcome') return result + transaction.value;

      return result;
    }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
