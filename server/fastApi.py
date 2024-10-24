from . import main
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# core permission
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


@app.get("/transaction")
async def get_items():
    record = main.getTransaction()
    return {"data": record}


class Transaction(BaseModel):
    amount: str
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


class DeleteTransaction(BaseModel):
    transaction_id: int

@app.delete("/transaction/delete")
async def delete_transaction(data: DeleteTransaction):
    main.deleteTransaction(data.transaction_id)
    record = main.getTransaction()
    return record


print(main.getTransaction())