from . import cwd
from datetime import date


def getTransaction():
    record = cwd.getTransaction()
    data = []
    sum = 0
    for transaction in record:
        if transaction[2] == "income":
            sum = sum + int(transaction[1])
        elif transaction[2] == "expense":
            sum = sum - int(transaction[1])
        thisDict = {'id':transaction[0],
                    'amount':transaction[1],
                    'type':transaction[2],
                    'description':transaction[3],
                    'date':transaction[4],
                    'time':transaction[5],
                    'sum':sum}
        
        data.append(thisDict)
    return data

def createNewTransaction(amount,type,description):
    data = getTransaction()
    transactionID = data[-1]['id'] + 1
    today = date.today()
    cwd.postNewTransaction(transactionID,amount,type,description,today)
    data = getTransaction()
    return data


def deleteTransaction(transactionID):
    cwd.deleteTransaction(transactionID)
    data = getTransaction()
    return data



