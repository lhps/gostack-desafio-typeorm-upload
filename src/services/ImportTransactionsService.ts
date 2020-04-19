// import csv from 'csv-parse';
import neatCsv from 'neat-csv';
import fs from 'fs';
import path from 'path';

// import AppError from '../errors/AppError';
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

    // const csvTransactions: CreateTransactionDTO[] = [];
    const transactions: Transaction[] = [];
    const pathFile = path.join(uploadConfig.directory, fileName);

    // await new Promise<CreateTransactionDTO[]>((resolve, reject) => {
    //   fs.createReadStream(pathFile)
    //     .pipe(csv({ delimiter: ',', columns: true, trim: true }))
    //     .on('data', async data => {
    //       csvTransactions.push(data);
    //     })
    //     .on('error', () => reject)
    //     .on('end', () => {
    //       resolve(csvTransactions);
    //       fs.promises.unlink(pathFile);
    //     });
    // });

    const rawData = await fs.promises.readFile(pathFile);

    const csvTransactions = await neatCsv<CreateTransactionDTO>(rawData, {
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim(),
    });

    for (const row of csvTransactions) {
      const transaction = await createTransaction.execute(row);
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
