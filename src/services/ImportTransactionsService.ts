import neatCsv from 'neat-csv';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];
    const pathFile = path.join(uploadConfig.directory, fileName);

    const csvFileData = await fs.promises.readFile(pathFile);

    const csvTransactions = await neatCsv<CreateTransactionDTO>(csvFileData, {
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim(),
    });

    for (const row of csvTransactions) {
      const transaction = await createTransaction.execute(row);
      transactions.push(transaction);
    }

    await fs.promises.unlink(pathFile);

    return transactions;
  }
}

export default ImportTransactionsService;
