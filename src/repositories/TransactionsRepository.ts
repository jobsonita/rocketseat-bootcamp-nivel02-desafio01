import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (acc, t) => ({ ...acc, [t.type]: acc[t.type] + t.value }),
      { income: 0, outcome: 0 },
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create(data: CreateTransactionDTO): Transaction {
    const { total } = this.getBalance();

    if (data.type === 'outcome' && data.value > total) {
      throw new Error('Cannot withdraw more than current balance');
    }

    const transaction = new Transaction(data);

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
