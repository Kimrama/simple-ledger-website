import mysql.connector

def postNewTransaction(transactionID,amount,type,description,date):
    db = mysql.connector.connect(
        host="10.20.23.40",
        user="db_admin",
        password="db_admin_password", 
        database="LedgerDatabase"
    )

    cursor = db.cursor()
    insert_query = """
        INSERT INTO transaction (transaction_id, amount, type, description, transaction_date) 
        VALUES (%s, %s, %s, %s, %s)
        """
    
    data = (transactionID, amount,type,description,date)
    cursor.execute(insert_query, data)
    db.commit()

    cursor.close()
    db.close()


def getTransaction():
    db = mysql.connector.connect(
        host="10.20.23.40", 
        user="db_admin",
        password="db_admin_password",
        database="LedgerDatabase"
    )

    cursor = db.cursor()
    select_query = "SELECT * FROM transaction;"
    cursor.execute(select_query)
    records = cursor.fetchall()

    cursor.close()
    db.close()
    return records

def deleteTransaction(transactionID):
    db = mysql.connector.connect(
        host="10.20.23.40", 
        user="db_admin",
        password="db_admin_password",
        database="LedgerDatabase"
    )

    cursor = db.cursor()
    delete_query = "DELETE FROM transaction WHERE transaction_id = %s;"
    id = (transactionID,)
    cursor.execute(delete_query,id)
    db.commit()

    cursor.close()
    db.close()

