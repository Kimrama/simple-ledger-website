from . import main
from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()

@app.get("/transaction")
async def get_items():
    record = main.getTransaction()
    return {"data": record}


class Transaction(BaseModel):
    amount: float
    type: str
    describe: str
    
@app.post("/transaction/add")
async def create_transaction(transaction: Transaction):
    if transaction.type not in ['income','expense']:
        return {"data": 'wrong type'}
    record = main.createNewTransaction(transaction.amount,transaction.type,transaction.describe)
    return {"data":record,
            "newTransaction":{'amount': transaction.amount, 'type': transaction.type, 'describe': transaction.describe},
            "status": 'Success'}

@app.delete("/transaction/delete")
async def delete_transaction(transaction_id: int):
    main.deleteTransaction(transaction_id)
    record = main.getTransaction()
    
    return record


print(main.getTransaction())